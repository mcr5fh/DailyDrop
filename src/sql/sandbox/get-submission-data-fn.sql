CREATE TYPE submission_with_data as 
(submission_id uuid,
 song_id text,
 song_name text,
 artist_name text,
 submitted_by text,
 num_votes integer,
 num_plays integer,
 date_added timestamp without time zone);


create or replace function dailydrop.get_data_for_group(
      group_uuid uuid,
      num_days integer,
      sort_column text
) returns setof submission_with_data 
-- no returns clause necessary, output structure controlled by OUT parameters
-- returns XXX
as 
$BODY$
declare
    rec record;
	sign text;
begin
	
	IF num_days < 0 THEN 
		sign := '>';
	ELSE 
		sign := '<';
	END IF;
	
 for rec in
   EXECUTE format(
   'WITH plays as (SELECT submission_id, COUNT(submission_id) as count
           FROM dailydrop.submission_play 
           WHERE age(now(), date_added) ' || sign || ' %L * interval %L
		GROUP BY submission_id),
        votes as (SELECT submission_id, COUNT(submission_id) as count
           FROM dailydrop.submission_votes 
           WHERE age(now(), date_added) ' || sign || ' %L * interval %L
		GROUP BY submission_id)
   SELECT 
     s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id,  
     COALESCE(plays.count, 0) as num_plays,
     COALESCE(votes.count, 0) as num_votes,
     s.date_added

    FROM dailydrop.Submission as s 
    LEFT JOIN dailydrop.submission_vote as votes
            on s.submission_id = votes.submission_id 
    LEFT JOIN dailydrop.submission_play as plays
            on s.submission_id = plays.submission_id 
    WHERE s.group_id = %L
    and age(now(), s.date_added) ' || sign || ' %L * interval %L
    ORDER BY %I DESC', num_days, '1 day', num_days, '1 day', group_uuid, num_days, '1 day',sort_column)
loop
        return next rec;
    end loop;
    -- no return statement necessary, output values already stored in OUT parameters
end
$BODY$ language plpgsql;