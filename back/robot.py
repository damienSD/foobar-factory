'''  '''
import asyncio
import os
import random
from typing import Callable

import redis

NETWORK_NAME = os.environ.get('NETWORK_NAME')
REDIS_NAME = os.environ.get('REDIS_NAME')
SPEED_FACTOR = float(os.environ.get('SPEED_FACTOR', "1"))
ROBOT_INDEX = os.environ.get('ROBOT_INDEX')

redis = redis.Redis(host=REDIS_NAME, port=6379, db=0, charset="utf-8", decode_responses=True)
abstract_time = lambda seconds: SPEED_FACTOR * seconds

class Activity(object): 
    ''' A generic resource activity type '''
    time: Callable[[], float]
    done = Callable
    duration: float
    success_on = lambda self, percent: random.random() <= float(percent / 100)
    def __init__(self): self.duration = self.time()
    def __repr__(self): return self.__class__.__name__
    def __str__(self): return self.__class__.__name__.lower()


class Foo(Activity):
    ''' Mine Foo takes 1 second '''
    time = lambda self: 1
    done = lambda self: redis.incr('stock:foos')


class Bar(Activity):
    ''' Mine Bar takes randomly between 0.5 and 2 seconds'''
    time = lambda self: random.uniform(0.5, 2)
    done = lambda self: redis.incr('stock:bars')


class Robot:
    ''' Robot attributes and storage '''
    foos: int = 0
    bars: int = 0
    foobars_built: int = 0
    activity : Activity = None
    index: int = ROBOT_INDEX


    async def work(self): 
        ''' Describe each work frame session '''

        foos = int(redis.get('stock:foos') or 0)
        bars = int(redis.get('stock:bars') or 0)

        # The first thing to do is building foobar if foos  and bars:
        if foos > 6 and bars: # PATCH: let's new robot coming for 6 foos some day...
            # use 1 foo 1 bar to build foobar
            redis.decr('stock:foos')
            redis.decr('stock:bars')

            # Building foobar engage 2 seconds working penality
            await self.do(message='Building foobar for 2 seconds and 60% success rate')
            await self.wait(2, 'foobar')

            # Build foobar success rate 60%
            if self.activity.success_on(60): 
                redis.incr('stock:foobars')
                redis.incr('built:foobars')
                await self.do(message='Foobar built successfuly')
            else:
                redis.incr('stock:bars')
                await self.info()
                await self.do(message='Foobar build failed, releasing 1 bar')

        # Randomly make the ressource type choice (Foo or bar)
        activity: Activity = random.choice([Foo, Bar])()

        # An previous activity change engage 5 seconds moving penality
        if self.activity and not isinstance( activity, type(self.activity) ):    
            await self.do(delay=5, activity='change', message=f'Changing activity from {self.activity} to {activity}, 5 seconds waiting')

        # Set the new activity as mining resource
        self.activity = activity
        await self.do(delay=self.activity.duration, activity=str(self.activity), message=f'Mining {self.activity} for {self.activity.duration} seconds')
        self.activity.done()
            
    async def do(self, delay=None, activity=None, message=None): 
        if activity:
            redis.set(f'robots:{self.index}:activity', activity)
        if message:
            await self.info(message)
            redis.set(f'robots:{self.index}:message', message)
        if delay:
            redis.set(f'robots:{self.index}:waiting', delay)
            await asyncio.sleep(abstract_time(delay))
            redis.delete(f'robots:{self.index}:waiting')

    async def info(self, message):
        print(message)
                

async def start():
    '''  '''
    robot = Robot()
    await robot.info(f'[Robot created {robot.index}]')

    while True: 
        if redis.get('factory:started'):
            await robot.work()
        await robot.do(delay=1, message="Waiting")

if __name__ == '__main__':
    '''  '''
    asyncio.run(start())
