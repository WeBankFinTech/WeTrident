---
id: release-android
title: Android 发布参考
---

# Android 发布参考

## 构建

使用常规构建工具构建apk包。对外发布的版本一般建议开启混淆，混淆在build.gradle中配置。

## 替换keystore
Android发布请先生情自己的发布keystore，不要使用示例中的 `keystores/demo-release-keystore` 做正式发布。可替换`keystores/demo-release-keystore`为自己的keystore路径并配套的设置密码和别名以及别名密码，然后运行如下命令: 

<span style="color: red">为了保证keystore的安全，通常不会把keystore放到代码库，这种情况可以用下面步骤生成的包重签名即可。</span>

## 打包
```
tdt release android
```

>完成构建打包和签名后，您可以把得到的apk发布到应用市场。

>但我们仍建议您跟随以下指引，以获得更好的安全性和运营手段。

>以下不作为发布前强制执行步骤。


## 加固

加固可以防止安装包轻易被恶意破壳篡改、反编译和二次编译，有利于提高安装包的安全等级。
推荐使用腾讯云的应用加固工具：[腾讯云](http://cloud.tencent.com) ➡️ 移动应用安全 ➡️ 应用加固


## 重签名

加固后的apk包需要重新签名才能正式对外发布。您可以根据项目的情况完成重签名。


## 生成市场渠道包

由于国内存在多种Android市场渠道，为了方便在版本发布后追踪、分析和统计用户数据，需要区分每一个渠道包。
本工具通过在META-INF目录添加渠道文件的方式提供生成渠道包的服务。

#####🙆‍♂️具体的使用方法

+ 配置channel_list.txt文件
  
  格式如下：
  
```
channelName=cdn
webank
yingyongbao
```
channelName，渠道名

渠道名下面为渠道号，生成的渠道包实际渠道号为channel_渠道号。

如果配置多个channelName，以第一个配置为准。

+ Terminal运行命令

```
tdt distribute androidPack
```

+ 打包结果会在Terminal展示出来

+ 将渠道包交付市场发布




