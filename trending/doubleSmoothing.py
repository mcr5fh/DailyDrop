from math import sqrt

'''
We are finding the # of standard deviations the actual result is
from the predicted result. As alpha increases, the weight historical data 
decreases, making the prediction more responsive to newer values. 
As beta increases, the weight of the historical trend/slope decreases,
making the prediction more responsive to recent changes in trend/slope.

The equations are as follows, more details here: https://analysights.wordpress.com/tag/exponential-smoothing/
Ct is the smoothed constant process value time t
Tt is the smoothed trend value time t.
Yt is the actual, observed data point at time t
Pt is the predicted value for time t 

Ct = αYt + (1-α)(Ct-1 + Tt-1)
Tt = β(Ct – Ct-1) + (1 – β)Tt-1
        Pt+1 = Ct + Tt

self.avg + self.trend = next predicted value

'''


class doubleSmoothing:
    def __init__(self, alpha, beta, pop=[]):
        self.sqrAvg = self.avg = 0
        self.alpha = alpha
        # The rate at which the historic data's effect will diminish.
        self.beta = beta
        for x in pop:
            self.update(x)

    def update(self, value):
        # Set initial averages to the first value in the sequence.
        if self.avg == 0 and self.sqrAvg == 0:
            self.avg = float(value)
            self.sqrAvg = float((value ** 2))
            self.trend = 0
        # Calculate the average of the rest of the values using a
        # floating average.
        else:
            lastAvg = self.avg
            self.avg = self.alpha * value + \
                (1 - self.alpha) * (self.avg + self.trend)
            self.sqrAvg = self.sqrAvg * (1 - self.alpha) + \
                (value ** 2) * (self.alpha)
            self.trend = self.beta * \
                (self.avg - lastAvg) + (1 - self.beta) * self.trend
        return self

    def std(self):
        # Somewhat ad-hoc standard deviation calculation.
        return sqrt(abs(self.sqrAvg - self.avg ** 2))

    def score(self, obs):
        if self.std() == 0:
            return (obs - self.avg) * float("infinity")
        else:
            print("Expected Value: " + str(self.avg + self.trend))
            return (obs - self.avg) / self.std()
