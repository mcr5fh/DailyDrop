echo "Bundling code..."
BundleName=RdsApi 
./bundle_fn.sh $BundleName #> /dev/null 2>&1
echo "Bundled."
#send to S3
aws s3 cp ./Zipped/"$BundleName"Bundle.zip s3://daily-drop-src/RDS/
aws lambda update-function-code --function-name RDSApi --s3-bucket daily-drop-src --s3-key RDS/"$BundleName"Bundle.zip 
