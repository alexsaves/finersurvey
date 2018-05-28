npm run prod
rm dist/survey.zip
rm package-lock.json
zip -r dist/survey.zip . -x ".git/*" -x "*.DS_Store" -x "sessions*" -x "staticsrc*" -x "node_modules*" -x "*.zip" -x "build*" -x "npm*" -x "dump.rdb" -x "*.sh" -x "dev*" -x "package-lock*"