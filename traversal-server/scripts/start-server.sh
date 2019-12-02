#!/bin/bash

BASE_DIR=`pwd`
if [ -e $BASE_DIR/traversal-server ];then
	cd $BASE_DIR/traversal-server
else
	echo "traversal server不存在，请检查您的配置"
	exit
fi

if [ -e  $BASE_DIR/traversal-server/node_modules ];then
	echo "环境检查通过"
else
	echo "环境检查不通过，正在安装依赖..."
	npm start
fi

fileName=`date '+%Y-%m-%d.txt'`
filePath="../records/$fileName"

if [ -e $filePath ];then
	read -p "检测到遍历记录存在，是否恢复测试上次？(y/n)" result
fi

if [ "$result" == "Y" ] || [ "$result" == "y" ];then
	echo "正在清除历史记录..."
	rm $filePath
fi

if [ -e "`adb devices`" ];then
	adb reverse tcp:3000 tcp:3000
fi

echo "启动traversal server"
npm start