--Reset User table
delete from dailydrop.User;
INSERT INTO dailydrop.User(user_id, premium, name, refresh_token) VALUES
        ('TestUser1', true, 'Tooters','rtoken1'),
        ('TestUser2', true, 'Aubs','rtoken2'),
        ('TestUser3', false, 'Blork','rtoken3');

--Reset Group table
delete from dailydrop.Group;
--only adding group_id for testing purposes
INSERT INTO dailydrop.Group(name, creator_user_id, group_id) VALUES
                        ('Gimme some MJ', 'TestUser1', '58c19e8a-98a0-46be-b94f-68f08c3ab82d'),
                        ('Bang my head', 'TestUser2', '4cccf9ee-1633-4cbb-b926-46284219e9cc');

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
		('Dong69', 'TestUser3', 'RDS_Lambda_Playlist_ID_1', 'Dirty Diana', 'MJ'),
		('Dong70', 'TestUser2', 'RDS_Lambda_Playlist_ID_1', 'Cant get enough', 'MJ'),
		('Dong73', 'TestUser1', 'RDS_Lambda_Playlist_ID_2', 'Banger1', '2F'),
		('Dong1213', 'TestUser3', 'RDS_Lambda_Playlist_ID_2', 'Banger2', '3F'),
		('New_Song', 'TestUser2', 'RDS_Lambda_Playlist_ID_2', 'Banger3', 'MJ'),
		('New_New_song', 'TestUser1', 'RDS_Lambda_Playlist_ID_2', 'Banger5', '5F');
