from math import sqrt


class fazscore:
    def __init__(self, decay, pop=[]):
        self.sqrAvg = self.avg = 0
        # The rate at which the historic data's effect will diminish.
        self.decay = decay
        for x in pop:
            self.update(x)

    def update(self, value):
        # Set initial averages to the first value in the sequence.
        if self.avg == 0 and self.sqrAvg == 0:
            self.avg = float(value)
            self.sqrAvg = float((value ** 2))
        # Calculate the average of the rest of the values using a
        # floating average.
        else:
            self.avg = value * self.decay + self.avg * (1 - self.decay)
            self.sqrAvg = self.sqrAvg * (1 - self.decay) + \
                (value ** 2) * self.decay
        return self

    def std(self):
        # Somewhat ad-hoc standard deviation calculation.
        return sqrt(self.sqrAvg - self.avg ** 2)

    def score(self, obs):
        if self.std() == 0:
            return (obs - self.avg) * float("infinity")
        else:
            return (obs - self.avg) / self.std()
