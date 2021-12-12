'''  '''
import random
from typing import Callable


class Activity(object):
    """A generic resource activity type"""

    time: Callable[[], float]
    done = Callable
    duration: float
    success_on = lambda self, percent: random.random() <= float(percent / 100)

    def __init__(self):
        self.duration = self.time()

    def __repr__(self):
        return self.__class__.__name__

    def __str__(self):
        return self.__class__.__name__.lower()

