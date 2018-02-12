##Run this from the package root!
rm DailyDrop.zip && \
zip -r9 DailyDrop.zip ./node_modules *.js sql postgres app && \
aws lambda update-function-code --function-name RDSApi --zip-file fileb://DailyDrop.zip