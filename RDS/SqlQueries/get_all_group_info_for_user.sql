SELECT
	(SELECT array_to_string(array_agg(g.group_id), ',')
		 	FROM dailydrop.Group AS g 
		 	JOIN dailydrop.Group_User AS gu on 
			gu.group_id = g.group_id 
			WHERE gu.user_id=$1  
	) as g_ids,
	(SELECT to_json(array_agg(row))
     FROM (SELECT *
		 	FROM dailydrop.User as u 
			JOIN dailydrop.Group_User AS gu on 
			u.user_id = gu.user_id 
			where gu.group_id IN
				(SELECT g.group_id
			 	FROM dailydrop.Group AS g 
			 	JOIN dailydrop.Group_User AS gu on 
				gu.group_id = g.group_id 
				WHERE gu.user_id=$1)
			)
	 row
	)as users_in_group,
	(SELECT to_json(array_agg(row))
     FROM (SELECT *
		 	FROM dailydrop.submission 
			where dailydrop.submission.group_id IN
				(SELECT g.group_id
			 	FROM dailydrop.Group AS g 
			 	JOIN dailydrop.Group_User AS gu on 
				gu.group_id = g.group_id 
				WHERE gu.user_id=$1)
			)
	 row
	)as subs_in_group,
	(SELECT to_json(array_agg(row))
     FROM (SELECT *
		 	FROM dailydrop.winner 
			where dailydrop.winner.group_id IN
				(SELECT g.group_id
			 	FROM dailydrop.Group AS g 
			 	JOIN dailydrop.Group_User AS gu on 
				gu.group_id = g.group_id 
				WHERE gu.user_id=$1)
			)
	 row
	)as winners_in_group
	;
