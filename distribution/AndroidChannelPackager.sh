echo 【1/4】清理文件
rm -rf bin
mkdir bin

echo 【2/4】准备源文件
sourceApk=android_release.apk
sourceApkPath=`find . -name $sourceApk`
if [ ! -n "$sourceApkPath" ]; then
	echo "[Error]: android_release.apk doesn't exists, check it out please."
	exit
fi
cp $sourceApk ./bin

function buildApks()
{

	echo 【3/4】开始打包
	#开始打CDN包....
	java -jar $PWD/WeBankChannelTool $PWD/$sourceApk channel_cdn.txt
	#开始打商店包....
	java -jar $PWD/WeBankChannelTool $PWD/$sourceApk channel_store.txt

	cp *.zip ./bin
	rm *.zip

	cd -
    echo 【4/4】打包完成

}

buildApks

