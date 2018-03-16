SELECT
    (SELECT to_json(array_agg(row))
     FROM (SELECT
            (SELECT COALESCE(to_json(array_agg(row)),'[]')
             FROM (SELECT * 
				   FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',1,'num_plays')
                   LIMIT 10) row
            ) AS one_day,
            (SELECT COALESCE(to_json(array_agg(row)),'[]')
             FROM (SELECT *
                   FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',10,'num_plays')
                   LIMIT 10) row
            ) AS ten_days) row
    ) AS num_plays,
    (SELECT to_json(array_agg(row))
     FROM (SELECT
            (SELECT COALESCE(to_json(array_agg(row)),'[]')
             FROM (SELECT * 
				   FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',1,'num_votes')
                   LIMIT 10) row
            ) AS one_day,
            (SELECT COALESCE(to_json(array_agg(row)),'[]')
             FROM (SELECT *
                   FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',10,'num_votes')
                   LIMIT 10) row
            ) AS ten_days) row
    ) AS num_votes,
    (SELECT to_json(array_agg(row))
     FROM (SELECT
            (SELECT COALESCE(to_json(array_agg(row)),'[]')
             FROM (SELECT * 
				   FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',1,'date_added')
                   LIMIT 10) row
            ) AS one_day,
            (SELECT COALESCE(to_json(array_agg(row)),'[]')
             FROM (SELECT *
                   FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',10,'date_added')
                   LIMIT 10) row
            ) AS ten_days) row
    ) AS recent;