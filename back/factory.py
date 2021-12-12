'''  '''
import asyncio
import os

import docker
import redis

BACK_IMAGE = os.environ.get('BACK_IMAGE')
NETWORK_NAME = os.environ.get('NETWORK_NAME')
REDIS_NAME = os.environ.get('REDIS_NAME')
ROBOT_NAME = os.environ.get('ROBOT_NAME')
SPEED_FACTOR = float(os.environ.get('SPEED_FACTOR', "1"))
FOOBAR_PRICE = float(os.environ.get('FOOBAR_PRICE', "1"))

client = docker.DockerClient(base_url="unix://var/run/docker.sock")
redis = redis.Redis(host=REDIS_NAME, port=6379, db=0, charset="utf-8", decode_responses=True)
abstract_time = lambda seconds: SPEED_FACTOR * seconds


class Factory:
    robots = []

    async def work(self):   

        if not redis.get('factory:success'):
        
            # Buy a new robot for 3 credit et 6 foos
            credits = float(redis.get('stock:credits') or 0)
            foos = int(redis.get('stock:foos') or 0)

            if credits >= 3.0 and foos >= 6:
                redis.decrby('stock:credits', 3)
                redis.decrby('stock:foos', 6)
                await self.do(activity='buying', message=f'''Buying 1 new robot for 3€ and 6foos''')            
                await self.add_robot()

            # Selling foobars available
            foobars_to_sell = min(5, int(redis.get('stock:foobars') or 0))
            if foobars_to_sell:
                amount = float(foobars_to_sell * FOOBAR_PRICE)
                await self.do(delay=10, activity='selling', message=f'''Selling {foobars_to_sell} foobar{"s" if foobars_to_sell > 1 else ""} for {amount}€''')
                redis.incrbyfloat('stock:credits', amount)
                redis.incrbyfloat('historic:credits', amount)
                redis.decrby('stock:foobars', foobars_to_sell)
                redis.delete(f'factory:selling')

    async def do(self, delay=None, activity=None, message=None, quiet=False): 
        if activity:
            not quiet and redis.set(f'factory:activity', activity)
        if message:
            await self.info(message)
            not quiet and redis.set(f'factory:message', message)
        if delay:
            not quiet and redis.set(f'factory:waiting', delay)
            await asyncio.sleep(abstract_time(delay))
            not quiet and redis.delete(f'factory:waiting')

    async def info(self, message):
        print(message)

    async def add_robot(self):    
        index = len(self.robots) + 1

        if index >= 30:
            redis.set('factory:success', 1)

        robot = client.containers.run(
            BACK_IMAGE,
            'python robot.py',
            name=f"{ROBOT_NAME}-{index}",
            network=NETWORK_NAME,
            detach=True,
            tty=True,
            environment=dict(**os.environ, ROBOT_INDEX=index)
        )
        self.robots.append(robot)

    async def add_redis(self):
        client.containers.run(
            "redis",
            name=REDIS_NAME,
            network=NETWORK_NAME,
            detach=True
        ) 


async def start():

    factory = Factory()
    await factory.info(f'[Factory created]')

    await factory.add_redis()
    await factory.add_robot()
    await factory.add_robot()

    redis.set('stock:foos', 0)
    redis.set('stock:bars', 0)
    redis.set('stock:foobars', 0)
    redis.set('stock:credits', 0)
    redis.set('historic:foobars', 0)
    redis.set('historic:foos', 0)
    redis.set('historic:bars', 0)
    redis.set('historic:credits', 0)

    while True:
        await factory.work()
        redis.set('factory:waiting', 1)
        event = redis.blpop(['start', 'stop', 'reset'], timeout=1)
        if event:   
            redis.delete('factory:waiting')
            match event[0]:
                case 'start':  
                    redis.set('factory:started', "1")
                case 'stop':  
                    redis.delete('factory:started')
                case 'reset':  
                    for robot in factory.robots:
                        robot.remove(force=True)
                    redis.delete('factory:success')
                    await start()



if __name__ == "__main__":    
    asyncio.run(start())
