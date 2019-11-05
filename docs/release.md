---
id: release
title: 构建和发布
---

Trident App的发布依赖fastlane，并且已经集成了最常用的一些插件。
## iOS构建和发布
iOS发布前需要保证你有一个可正常使用的苹果开发者账号。

### 图标替换
// TODO

### 闪屏替换
// TODO

### iOS发布(生成ipa包)
``` shell
tdt release ios
```

// TODO 这里需要增加faq

## Android构建和发布
### 图标替换
// TODO

### Android构建
Android发布请先生情自己的发布keystore，不要使用示例中的 `keystores/demo-release-keystore` 做正式发布。可替换`keystores/demo-release-keystore`为自己的keystore路径并配套的设置密码和别名以及别名密码，然后运行如下命令: 
``` shell
tdt release android
```
<span style="color: red">为了保证keystore的安全，不要把keystore放到代码库，这种情况可以考虑将keystore和对应的密码都放到外部通过环境变量传入给fastlane。</span>

运行完成以后生成的APK既可以用于发布。
