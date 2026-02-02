#bash 
cd android
rm -rf .gradle build app/build
./gradlew clean --no-configuration-cache

cd ..