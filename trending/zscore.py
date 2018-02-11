from math import sqrt

def zscore(obs, pop):
    # Size of population.
    number = float(len(pop))
    # Average population value.
    avg = sum(pop) / number
    # Standard deviation of population.
    std = sqrt(sum(((c - avg) ** 2) for c in pop) / number)
    # Zscore Calculation.
    return (obs - avg) / std
