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
    credits: int = 0
    foobars: int = 0
    robots = []

    async def wait(self, delay, task='waiting'): 
        redis.set(f'factory:{task}', delay)
        if delay:
            await asyncio.sleep(abstract_time(delay))
        redis.delete(f'factory:{task}')

    async def info(self, message):
        print(message)

    async def work(self):   
        
        
        # Buy a new robot for 3 credit et 6 foos
        credits = float(redis.get('stock:credits') or 0)
        foos = int(redis.get('foos') or 0)
        if credits >= 3.0 and foos >= 6:
            redis.set('factory:buying', 1)
            redis.decrbyfloat('stock:credits', 3)
            redis.decrby('stock:foos', 6)
            await self.info(f'''Buying 1 new robot''')
            await self.add_robot()
            redis.delete(f'factory:buying')

        # Selling foobars available
        foobars_to_sell = min(5, int(redis.get('stock:foobars') or 0))
        if foobars_to_sell:
            redis.set('factory:selling', foobars_to_sell)
            await self.info(f'''Selling {foobars_to_sell} foobar{"s" if foobars_to_sell > 1 else ""}''')
            await self.wait(10, 'selling')
            redis.incrbyfloat('stock:credits', float(foobars_to_sell * FOOBAR_PRICE))
            redis.decrby('stock:foobars', foobars_to_sell)
            redis.delete(f'factory:selling')



    async def add_robot(self):    
        index = len(self.robots) + 1
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
    redis.set('built:foobars', 0)

    while True:
        await factory.work()        
        await factory.wait(0)
        event = redis.blpop(['start', 'stop'], timeout=1)
        if event:   
            match event[0]:
                case 'start':  
                    redis.set('factory:started', "1")
                case 'stop':  
                    redis.delete('factory:started')



if __name__ == "__main__":    
    asyncio.run(start())
