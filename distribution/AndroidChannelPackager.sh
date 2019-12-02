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
	java -jar $PWD/webankchanneltools.jar $PWD/$sourceApk channel_list.txt

	cp *.zip ./bin
	rm *.zip

	cd -
    echo 【4/4】打包完成，文件路径：$PWD/bin/渠道名称—apks.zip

}

buildApks

