echo "Bundling code..."
BundleName=SpotifyApi 
./bundle_fn.sh $BundleName #> /dev/null 2>&1
echo "Bundled."
#send to S3
aws s3 cp ./Zipped/"$BundleName"Bundle.zip s3://daily-drop-src/Spotify/
aws lambda update-function-code --function-name SpotifyApi --s3-bucket daily-drop-src --s3-key Spotify/"$BundleName"Bundle.zip 
