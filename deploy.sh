npm run prod
rm dist/survey.zip
zip -r dist/survey.zip . -x ".*" -x "node_modules*" -x "*.zip" -x "build*" -x "npm*" -x "dump.rdb" -x "*.sh" -x "dev*" -x "package-lock*"