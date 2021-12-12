'''  '''
import asyncio
import os
import random

from activity import Activity
from factory import (FACTORY_STARTED, FACTORY_SUCCESS, STOCK_BARS,
                     STOCK_FOOBARS, STOCK_FOOS, abstract_time, redis)

ROBOT_INDEX = os.environ.get("ROBOT_INDEX")
ROBOT_ROOT = f"robots:b{ROBOT_INDEX}"
ROBOT_ACTIVITY = f"{ROBOT_ROOT}:activity"
ROBOT_MESSAGE = f"{ROBOT_ROOT}:message"
ROBOT_WAITING = f"{ROBOT_ROOT}:waiting"
ROBOT_HISTORIC = f"{ROBOT_ROOT}:historic"
ROBOT_HISTORIC_FOOS = f"{ROBOT_HISTORIC}:foos"
ROBOT_HISTORIC_BARS = f"{ROBOT_HISTORIC}:bars"
ROBOT_HISTORIC_FOOBARS = f"{ROBOT_HISTORIC}:foobars"
ROBOT_HISTORIC_FOOBARS_FAILS = f"{ROBOT_HISTORIC}:foobarsFails"

class Foo(Activity):
    """Mine Foo takes 1 second"""
    time = lambda self: 1
    done = lambda self: redis.incr(STOCK_FOOS) and redis.incr(ROBOT_HISTORIC_FOOS)


class Bar(Activity):
    """Mine Bar takes randomly between 0.5 and 2 seconds"""
    time = lambda self: random.uniform(0.5, 2)
    done = lambda self: redis.incr(STOCK_BARS) and redis.incr(ROBOT_HISTORIC_BARS)

class Robot:
    """Robot attributes and storage"""

    activity: Activity = None

    async def work(self):
        """Describe each work frame session"""

        foos = int(redis.get(STOCK_FOOS) or 0)
        bars = int(redis.get(STOCK_BARS) or 0)

        # The first thing to do is building foobar if foos  and bars:
        if foos > 6 and bars:  # PATCH: let's new robot coming for 6 foos some day...
            # use 1 foo 1 bar to build foobar
            redis.decr(STOCK_FOOS)
            redis.decr(STOCK_BARS)

            # Building foobar engage 2 seconds working penality
            await self.do(delay=2, activity="foobar", message="Building foobar for 2 seconds and 60% success rate")

            # Build foobar success rate 60%
            if self.activity.success_on(60):
                redis.incr(STOCK_FOOBARS)
                redis.incr(ROBOT_HISTORIC_FOOBARS)
                await self.do(message="Foobar built successfuly")

            else:
                redis.incr(STOCK_BARS)
                redis.incr(ROBOT_HISTORIC_FOOBARS_FAILS)
                await self.do(message="Foobar build failed, releasing 1 bar")

        # IF there is no foobars to build, let's go mining..
        else:

            # Randomly takes a new activity (Foo or bar)
            activity: Activity = random.choice([Foo, Bar])()

            # An previous activity change engage 5 seconds moving penality
            if self.activity and not isinstance(activity, type(self.activity)):
                await self.do(
                    delay=5,
                    activity="change",
                    message=f"Changing activity from {self.activity} to {activity}, 5 seconds waiting",
                )

            # Set the new activity as mining resource
            self.activity = activity
            await self.do(
                delay=self.activity.duration,
                activity=str(self.activity),
                message=f"Mining {self.activity} for {self.activity.duration} seconds",
            )
            self.activity.done()

    async def do(self, delay=None, activity=None, message=None, quiet=False):
        """ Update states and messages """
        if activity:
            not quiet and redis.set(ROBOT_ACTIVITY, activity)
        if message:
            await self.info(message)
            not quiet and redis.set(ROBOT_MESSAGE, message)
        if delay:
            redis.set(ROBOT_WAITING, delay if not quiet else -1 )
            await asyncio.sleep(abstract_time(delay))
            redis.delete(ROBOT_WAITING)

    async def info(self, message):
        print(message)


    async def init(self):
        """ """
        await robot.info(f"[Robot initialized {ROBOT_INDEX}]")
        while True:
            if redis.get(FACTORY_STARTED) and not redis.get(FACTORY_SUCCESS):
                await self.work()
            else:
                await self.do(delay=1, message="Waiting", quiet=True)


if __name__ == "__main__":
    """ """
    robot = Robot()
    asyncio.run(robot.init())
