rm ./Zipped/"$1"Bundle.zip;
cd $(pwd)/node_modules;
zip -r9 ../Zipped/"$1"Bundle.zip * ;
cd ..;
zip -r9g ./Zipped/"$1"Bundle.zip SqlQueries;
zip -g ./Zipped/"$1"Bundle.zip rdsCore.js index.js;

# needed for the lambda
# filename.js
# node_modules/async
# node_modules/async/lib
# node_modules/async/lib/async.js
# node_modules/async/package.json