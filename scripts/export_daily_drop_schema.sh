#Exports the SQL commands nededed to create the tables and relations of the DailyDrop db

ROOT_USER="root"
DATABASE="DailyDrop"
RDS_ENDPOINT="dailydrop.c4noeotwvren.us-east-1.rds.amazonaws.com"
EXPORT_FILE_NAME="bootstrap_DailyDrop.sql"

#  -b, --blobs                  include large objects in dump
#  -v, --verbose                verbose mode
#  -f, --file=FILENAME          output file or directory name
/Library/PostgreSQL/9.6/bin/pg_dump -h $RDS_ENDPOINT -p 5432 -U $ROOT_USER -d $DATABASE \
        -f $EXPORT_FILE_NAME -b -v 
