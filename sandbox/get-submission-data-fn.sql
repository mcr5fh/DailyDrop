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

begin
 for rec in
   EXECUTE format(
   'SELECT 
    s.submission_id, s.song_id, s.song_name, s.artist_name, s.user_id,  
    COALESCE(sm.num_votes,0), COALESCE(sm.num_plays, 0), s.date_added

    FROM dailydrop.Submission as s 
    LEFT JOIN dailydrop.Submission_Metrics as sm 
        on s.submission_id = sm.submission_id 
    WHERE s.group_id = %L
    and age(now(), s.date_added) < %L * interval %L
    ORDER BY %I DESC', group_uuid, num_days, '1 day',sort_column)
loop
        return next rec;
    end loop;
    -- no return statement necessary, output values already stored in OUT parameters
end
$BODY$ language plpgsql;