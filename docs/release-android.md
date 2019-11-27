---
id: release-android
title: Android 发布参考
---

# Android 发布参考 TODO

## 替换keystore
Android发布请先生情自己的发布keystore，不要使用示例中的 `keystores/demo-release-keystore` 做正式发布。可替换`keystores/demo-release-keystore`为自己的keystore路径并配套的设置密码和别名以及别名密码，然后运行如下命令: 

<span style="color: red">为了保证keystore的安全，通常不会把keystore放到代码库，这种情况可以用下面步骤生成的包重签名即可。</span>

## 打包
```
tdt release android
```


## 生成市场渠道包 TODO
 
```
tdt distribute
```
