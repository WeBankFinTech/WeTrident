#!/bin/bash

currentDir=${PWD}
tempDir=~/.tridentTemp
mkdir $tempDir
cd $tempDir
rm -rf $tempDir/WeBookStore
tdt init --name=WeBookStore --bundleId=com.trident.wbstore --scheme=wbstore --port=8081 --eslint
cd $tempDir/WeBookStore


# 验证init完成以后是否能正常release
# tdt release ios --verbose
# tdt release android --verbose

# 确认demo能正常启动
tdt run ios
tdt run android

# 需要用户确认一下
# rm -rf $tempDir/WeBookStore

