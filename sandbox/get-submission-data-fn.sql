
DROP FUNCTION dailydrop.get_data_for_group(uuid, integer, text);

SELECT * FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',1,'date_added');

SELECT * FROM dailydrop.get_data_for_group('4cccf9ee-1633-4cbb-b926-46284219e9cc',1,'num_plays');

CREATE TYPE submission_with_data as 
(submission_id uuid,
 song_id text,
 song_name text,
 artist_name text,
 submitted_by text,
 num_votes integer,
 num_plays integer,
 date_added timestamp without time zone);

CREATE OR REPLACE function dailydrop.get_data_for_group(
      group_uuid uuid,
      num_days integer,
      sort_column text
) returns setof submission_with_data 
AS
$BODY$
DECLARE
    rec record;
BEGIN
FOR rec IN
   SELECT 
    s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id,  
    sm.num_votes, sm.num_plays, s.date_added
    FROM dailydrop.Submission as s 
    LEFT JOIN dailydrop.Submission_Metrics as sm 
        on s.submission_id = sm.submission_id 
    WHERE s.group_id = group_uuid
    and age(now(), s.date_added) < num_days * interval '1 day'
    ORDER BY quote_ident(sort_column)  DESC
    LIMIT 10
LOOP
    return next rec;
END LOOP;
    -- no return statement necessary, output values already stored in OUT parameters
END
$BODY$ language plpgsql;




-- These will be used in:
SELECT
    (SELECT to_json(array_agg(row))
     FROM (SELECT
            (SELECT to_json(array_agg(row))
             FROM (SELECT *
                   FROM dailydrop.user t
                   LIMIT 10) row
            ) AS day,
            (SELECT to_json(array_agg(row))
             FROM (SELECT *
                   FROM dailydrop.group g
                   LIMIT 10) row
            ) AS week) row
    ) AS popular,
    (SELECT to_json(array_agg(row))
     FROM (SELECT *
           FROM dailydrop.submission) row
     ) AS subs;