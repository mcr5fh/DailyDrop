WITH observation AS (SELECT submission_id, (num_plays - num_plays_yest) as plays FROM dailydrop.submission_metrics AS m),
	 previous_avg AS (select COALESCE(avg,0) from dailydrop.Submission_zscore),
	 new_avg AS (SELECT
			dailydrop.smoothing_alpha() * (SELECT num_plays - num_plays_yest as plays FROM dailydrop.submission_metrics AS m where m.submission_id = s.submission_id) + (1 - dailydrop.smoothing_alpha()) * (s.avg + s.trend) as value, submission_id from dailydrop.Submission_zscore as s) 
--			(select num_plays as value, submission_id from dailydrop.submission_metrics AS m WHERE m.submission_id = s.submission_id)) 
--			from dailydrop.Submission_zscore as s)
			
UPDATE dailydrop.Submission_zscore as score
----self.avg = self.alpha * value + (1 - self.alpha) * (self.avg + self.trend)
--SET avg = COALESCE(
--			dailydrop.smoothing_alpha() * observation.plays + (1 - dailydrop.smoothing_alpha()) * (score.avg + score.trend),
--			observation.plays)
SET avg = new_avg.value
		   ,
			
--self.sqrAvg = self.sqrAvg * (1 - self.alpha) +  (value ** 2) * (self.alpha)
sqr_avg = COALESCE(
			sqr_avg * (1 - dailydrop.smoothing_alpha()) + 
			(observation.plays ^ 2) * dailydrop.smoothing_alpha(),
			(observation.plays ^ 2)),
--self.trend = self.beta * (avg - lastAvg) + (1 - self.beta) * self.trend
trend = COALESCE(
			dailydrop.smoothing_beta() * (new_avg.value - avg) + (1 - dailydrop.smoothing_beta()) * trend,
			1)
FROM observation as observation
LEFT OUTER JOIN new_avg as new_avg 
on observation.submission_id = new_avg.submission_id 
where score.submission_id = observation.submission_id;