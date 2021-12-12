'''  '''
import asyncio
import os

import docker
import redis

# global variables
BACK_IMAGE = os.environ.get('BACK_IMAGE')
NETWORK_NAME = os.environ.get('NETWORK_NAME')
REDIS_NAME = os.environ.get('REDIS_NAME')
ROBOT_NAME = os.environ.get('ROBOT_NAME')
SPEED_FACTOR = float(os.environ.get('SPEED_FACTOR', "1"))
FOOBAR_PRICE = float(os.environ.get('FOOBAR_PRICE', "1"))

# Storage keys
STOCK_CREDITS = 'stock:credits'
STOCK_FOOS = 'stock:foos'
STOCK_BARS = 'stock:bars'
STOCK_FOOBARS = 'stock:foobars'
HISTORIC_CREDITS = "historic:credits"
HISTORIC_SELLS = "historic:sells"
FACTORY_ACTIVITTY = 'factory:activity'
FACTORY_STARTED = 'factory:started'
FACTORY_SUCCESS = 'factory:success'
FACTORY_WAITING = 'factory:waiting'

# global helpers
redis = redis.Redis(host=REDIS_NAME, port=6379, db=0, charset="utf-8", decode_responses=True)
abstract_time = lambda seconds: seconds / min(10, max(1, SPEED_FACTOR))


class Factory:
    robots = []

    async def work(self):   
        
        credits = float(redis.get(STOCK_CREDITS) or 0)
        foos = int(redis.get(STOCK_FOOS) or 0)
        foobars_to_sell = min(5, int(redis.get(STOCK_FOOBARS) or 0))

        # Buy a new robot for 3 credit et 6 foos
        if credits >= 3.0 and foos >= 6:
            redis.decrby(STOCK_CREDITS, 3)
            redis.decrby(STOCK_FOOS, 6)
            await self.do(activity='buying', message=f'''Buying 1 new robot for 3€ and 6foos''')            
            await self.add_robot()

        # Selling foobars available
        if foobars_to_sell:
            amount = float(foobars_to_sell * FOOBAR_PRICE)
            await self.do(delay=10, activity='selling', message=f'''Selling {foobars_to_sell} foobar{"s" if foobars_to_sell > 1 else ""} for {amount}€''')
            redis.incrbyfloat(STOCK_CREDITS, amount)
            redis.incrbyfloat(HISTORIC_CREDITS, amount)
            redis.incrby(HISTORIC_SELLS, foobars_to_sell)
            redis.decrby(STOCK_FOOBARS, foobars_to_sell)

    async def do(self, delay=None, activity=None, message=None, quiet=False): 
        """ Update states and messages """
        if activity:
            not quiet and redis.set(FACTORY_ACTIVITTY, activity)
        if message:
            await self.info(message)
            not quiet and redis.set(f'factory:message', message)
        if delay:            
            redis.set(f"factory:waiting", delay if not quiet else -1 )
            await asyncio.sleep(abstract_time(delay))
            redis.delete(f"factory:waiting")

    async def info(self, message):
        print(message)

    async def add_robot(self):    
        """ Create a new robot instance (container) """
        index = len(self.robots) + 1

        if index >= 30:
            redis.set(FACTORY_SUCCESS, 1)

        robot = self.docker.containers.run(
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
        """ Create a new redis instance (container) """
        self.docker.containers.run(
            "redis",
            name=REDIS_NAME,
            network=NETWORK_NAME,
            detach=True
        ) 
        # wait for redis
        while True:
            try:
                redis.ping()
                break
            except Exception as e:
                print(e)
                await asyncio.sleep(1)
        
    async def reset(self):

        # Remove robot existing containers
        for robot in self.robots:
            robot.remove(force=True)
        self.robots = []

        # Reset storage values
        redis.delete(FACTORY_SUCCESS)
        redis.delete(FACTORY_STARTED)
        redis.set(STOCK_FOOS, 0)
        redis.set(STOCK_BARS, 0)
        redis.set(STOCK_FOOBARS, 0)
        redis.set(STOCK_CREDITS, 0)
        redis.set(HISTORIC_CREDITS, 0)
        redis.set(HISTORIC_SELLS, 0)

        # Add initial 2 robots
        await self.add_robot()
        await self.add_robot()

    async def init(self):

        self.docker = docker.DockerClient(base_url="unix://var/run/docker.sock")

        await self.info(f'[Factory initialized]')
        await self.add_redis()
        await self.reset()

        # Make alive
        while True:
        
            # Work only if no success yet and started
            if redis.get(FACTORY_STARTED) and not redis.get(FACTORY_SUCCESS):
                await self.work()

            redis.set(FACTORY_WAITING, -1) # Just for the event by blpop does the waiting process

            # Wait 1 secondes for particular events
            # TODO: make that in other internal thread/process
            event = redis.blpop(['start', 'stop', 'reset'], timeout=1)
            if event:   

                redis.delete(FACTORY_WAITING)
                match event[0]:
                    case 'start':  
                        redis.set(FACTORY_STARTED, "1")
                    case 'stop':  
                        redis.delete(FACTORY_STARTED)
                    case 'reset':  
                        await self.reset()



if __name__ == "__main__": 
    factory = Factory()
    asyncio.run(factory.init())
