---
id: release
title: 构建和发布
---

Trident App的发布依赖fastlane，并且已经集成了最常用的一些插件。
## iOS发布
``` shell 
# 构建发布包，构建完成以后可以通过Application Loader发布
bundle exec fastlane ios release --verbose
```

``` shell
# 构建发布包并自动发布到testflight，过程中会提示输入信息
bundle exec fastlane ios upload_to_testflight --verbose
```

## Android发布
Android发布请先生情自己的发布keystore，不要使用示例中的 `keystores/demo-release-keystore` 做正式发布。可替换`keystores/demo-release-keystore`为自己的keystore路径并配套的设置密码和别名以及别名密码，然后运行如下命令: 
``` shell
bundle exec fastlane android release --verbose
```
为了保证keystore的安全，不要把keystore放到代码库，这种情况可以考虑将keystore和对应的密码都放到外部通过环境变量传入给fastlane。


