SELECT
    (SELECT to_json(array_agg(row))
     FROM (SELECT *
            FROM dailydrop.User as u 
            JOIN dailydrop.Group_User AS gu on 
            u.user_id = gu.user_id 
            where gu.group_id = $1
            )
     row
    )as users_in_group,
    (SELECT to_json(array_agg(row))
     FROM (SELECT *
            FROM dailydrop.submission 
            where dailydrop.submission.group_id = $1
            )
     row
    )as subs_in_group;