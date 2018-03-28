WITH observation AS (SELECT num_plays - num_plays_yest FROM dailydrop.submission_metrics AS m WHERE m.submission_id = s.submission_id),
	 previous_avg AS (select COALESCE(avg,0) from dailydrop.Submission_zscore),
	 new_avg AS (SELECT COALESCE(
			dailydrop.smoothing_alpha() * (SELECT num_plays - num_plays_yest FROM dailydrop.submission_metrics AS metric
										   WHERE metric.submission_id = score.submission_id) + (1 - dailydrop.smoothing_alpha()) * (score.avg + score.trend), 
			(select num_plays from dailydrop.submission_metrics AS m WHERE m.submission_id = score.submission_id)))
			
UPDATE dailydrop.Submission_zscore as score
----self.avg = self.alpha * value + (1 - self.alpha) * (self.avg + self.trend)
SET avg = new_avg,
			
--self.sqrAvg = self.sqrAvg * (1 - self.alpha) +  (value ** 2) * (self.alpha)
sqr_avg = COALESCE(
			sqr_avg * (1 - dailydrop.smoothing_alpha()) + 
			(observation ^ 2) * dailydrop.smoothing_alpha(),
			(observation ^ 2)),
--self.trend = self.beta * (avg - lastAvg) + (1 - self.beta) * self.trend
trend = COALESCE(
			dailydrop.smoothing_beta() * (new_avg - previous_avg) + (1 - dailydrop.smoothing_beta()) * trend,
			1)
);