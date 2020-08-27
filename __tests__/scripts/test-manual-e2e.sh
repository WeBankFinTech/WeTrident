#!/bin/bash

RED="\033[0;31m"
GREEN="\033[0;32m"
BLUE="\033[0;35m"
ENDCOLOR="\033[0m"

error() {
    echo -e $RED"$@"$ENDCOLOR
    exit 1
}

success() {
    echo -e $GREEN"$@"$ENDCOLOR
}

info() {
    echo -e $BLUE"$@"$ENDCOLOR
}

info() {
    echo -e $BLUE"$@"$ENDCOLOR
}

node_modules/jest/bin/jest.js --silent

currentDir=${PWD}
tempDir=$currentDir/.tridentTemp
projectName=WeBookStore
mkdir -p $tempDir
cd $tempDir

rm -rf $tempDir/$projectName
tdt init --name=WeBookStore --bundleId=com.trident.wbstore --scheme=wbstore --eslint --template=tab
cd $tempDir/$projectName

info "Checking the versions in build.gradle are correct:"
grep -E "com.facebook.react:react-native:\\+" "$tempDir/$projectName/android/app/build.gradle" || error "Dependency in $tempDir/$projectName/android/app/build.gradle must be com.facebook.react:react-native:+"

# test the 'gen' cli
tdt gen module --moduleName=moduleA --onlyModule
tdt gen scene --moduleName=moduleA --sceneName=sceneB --onlyOnceTime

# test plugin init
tdt plugin init moduleA

# test plugin publish
# tdt plugin publish moduleA

info "Start the packager in another terminal by running 'tdt packager start' from the $tempDir/WeBookStore"
info "and then press any key."
info ""
read -n 1
tdt run ios

info "Start the Android emulator before go on"
info "and then press any key."
info ""
read -n 1
tdt run android
