rm DailyDrop.zip;
zip -r9 DailyDrop.zip ./node_modules *.js SqlQueries;
aws lambda update-function-code --function-name RDSApi --zip-file fileb://DailyDrop.zip