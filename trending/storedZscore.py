from math import sqrt

class zscore:
    def __init__(self, pop = []):
        self.number = float(len(pop))
        self.total = sum(pop)
        self.sqrTotal = sum(x ** 2 for x in pop)
    def update(self, value):
        self.number += 1.0
        self.total += value
        self.sqrTotal += value ** 2
    def avg(self):
        return self.total / self.number
    def std(self):
        return sqrt((self.sqrTotal / self.number) - self.avg() ** 2)
    def score(self, obs):
        return (obs - self.avg()) / self.std()
