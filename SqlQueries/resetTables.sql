--Reset User table
delete from dailydrop.User;
INSERT INTO dailydrop.User(user_id, premium, name, refresh_token) VALUES
        ('TestUser1', true, 'Tooters','rtoken1'),
        ('TestUser2', true, 'Aubs','rtoken2'),
        ('TestUser3', false, 'Blork','rtoken3');

--Reset Group table
delete from dailydrop.Group;
--only adding group_id for testing purposes
INSERT INTO dailydrop.Group(name, creator_user_id, group_id, description) VALUES
                        ('Gimme some MJ', 'TestUser1', '58c19e8a-98a0-46be-b94f-68f08c3ab82d', 'Description1'),
                        ('Bang my head', 'TestUser2', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Description1');

--Reset Group_User table
delete from dailydrop.Group_User;
INSERT INTO dailydrop.Group_User(user_id, group_id) VALUES
                        ('TestUser1', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('TestUser2', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('TestUser3', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc'),
                        ('TestUser3', '4cccf9ee-1633-4cbb-b926-46284219e9cc');

--Reset Submission table
delete from dailydrop.submission;
INSERT INTO dailydrop.Submission(song_id, user_id, group_id, song_name,artist_name) VALUES
		('Dong69', 'TestUser3', '58c19e8a-98a0-46be-b94f-68f08c3ab82d', 'Dirty Diana', 'MJ'),
		('Dong70', 'TestUser2', '58c19e8a-98a0-46be-b94f-68f08c3ab82d', 'Cant get enough', 'MJ'),
		('Dong73', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger1', '2F'),
		('Dong1213', 'TestUser3', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger2', '3F'),
		('New_Song', 'TestUser2', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger3', 'MJ'),
		('New_New_song', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Banger5', '5F');
INSERT INTO dailydrop.Submission(song_id, user_id, group_id, song_name, artist_name, submission_id) VALUES
		('Played Song 1', 'TestUser1', '4cccf9ee-1633-4cbb-b926-46284219e9cc', 'Forget 2 friends I have 5', '5F', 'a1ef3cd9-1a42-4f3f-90a7-b8760edbac4f')
		('Played Song 2', 'TestUser2', '2bca6d38-617f-4f9b-905b-f695ab8943c2', 'Tiesto Cranks', 'Tiesto', '2bca6d38-617f-4f9b-905b-f695ab8943c2')

--Reset Play and Vote table. One has more votes, one has more plays
delete from dailydrop.play;
INSERT INTO dailydrop.play(submission_id, user_id, date_added) VALUES
		('a1ef3cd9-1a42-4f3f-90a7-b8760edbac4f', 'TestUser3', '2018-02-01'),
		('a1ef3cd9-1a42-4f3f-90a7-b8760edbac4f', 'TestUser2', '2017-02-01'),
		('2bca6d38-617f-4f9b-905b-f695ab8943c2', 'TestUser2', '2018-02-01');

delete from dailydrop.vote;
INSERT INTO dailydrop.vote(submission_id, user_id, date_added) VALUES
		('a1ef3cd9-1a42-4f3f-90a7-b8760edbac4f', 'TestUser2', '2018-02-01'),
		('2bca6d38-617f-4f9b-905b-f695ab8943c2', 'TestUser3', '2017-02-01'),
		('2bca6d38-617f-4f9b-905b-f695ab8943c2', 'TestUser2', '2018-02-01');