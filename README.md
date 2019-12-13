
[![](https://img.shields.io/badge/node-%3E%3D8.3.0-brightgreen.svg)](https://nodejs.org/en/)
[![](https://img.shields.io/badge/npm-%3E%3D5.8.0-brightgreen.svg)](https://nodejs.org/en/)
[![](https://img.shields.io/badge/git-%3E%3D2.9.0-brightgreen.svg)](https://git-scm.com/)
[![](https://img.shields.io/badge/fastlane-%3E%3D2.117.1-brightgreen.svg)](https://fastlane.tools/)
[![](https://img.shields.io/badge/pod-%3E%3D1.4.0-brightgreen.svg)](https://cocoapods.org/)

## WeTrident的目标
可快速开发支持商业运营App的框架。

## WeTrident的开发背景
WeTrident由微众银行App团队开发，开发过程中我们通过调研其他一些RN的开发框架发现大部分适合比较小的项目，或者是用到后期要真实运营的时候还需要补充很多运营相关的基础能力。
要开发真正商业运营的App，需要很多打磨，没有办法做到快速开发高质量产品，以此为出发点我们开发了WeTrident，希望在开发、运营、测试几方面提供更好的基础开发设施。

WeTrident的技术选型风格如我们团队一样，稳健为第一要求，不盲目追求新技术炫技而随意使用不稳定的技术方案。
在时尚前沿和稳定实用中我们毫不犹豫会选择稳定实用，这也是WeTrident作为一套开发可商业运营App的框架的基础原则。
如果你的团队也需要快速开发稳定高质量的产品，那WeTrident应该会成为你的选择。

## WeTrident给你提供了什么
1. 一套经过时间验证的技术栈，免去你选择各种技术尝试各种新技术踩坑额外耗费的时间。
2. 一套规范的App架构定义，即使新人也可以快速的开发出高质量代码
3. 丰富完整的调试信息，简化调试的难度
4. 一套完善的构建和发布环境，帮你避开各种构建环境的坑。

PS: WeTrident在设计过程中会增加一些限制，作为一套通用框架，我们深知应该留给使用者足够的扩展空间，所以我们在设计过程中尽可能的控制限制的数量。
并且做到，"框架增加一项限制，就至少给使用者带来一批好处"。

## 开发环境依赖
WeTrident目前仅支持macOS，其余环境WeTrident都会做详细的提示来协助安装。
开始开发前需要先配置Android和iOS开发环境，具体配置方法可以参考Android和iOS官方文档。

## 创建项目
为了快速的理解WeTrident的使用，我们从一个简单应用开始，逐步的说明各种基础用法。整个讲解过程中一些UI细节实现不会详细描述，所以建议你把WeBookStore的git库clone下来，跟着尝试会有比较不错的效果。

我们开发一个简单的图书管理App，App的页面如下：
![](assets/images/2019-06-24-03-55-20.png)

- App名称: WeBookStore
- App BundleId(Android上的packageName): com.trident.wbstore
- App schema: wbstore

### 创建项目
#### 1. 安装trident-cli
``` shell
npm install -g @webank/trident-cli
```

#### 2. 用trident-cli 创建项目
``` shell
tdt init --name=WeBookStore --bundleId=com.trident.wbstore --scheme=wbstore --eslint
```
等待安装完成即可, 如果需要自定义这些参数也可运行 `tdt init` 并根据命令行提示输入自定义参数即可。

PS: 初始化过程中会对当前的开发环境做检查，如果有提示某些环境不满足，请先按照提示安装或者升级。

#### 3. 启动应用(iOS)
``` shell
cd WeBookStore

# 启动react native packager
tdt packager start

# 通过命令行启动App
tdt run ios 

# 也可以在XCode中打开项目, 在XCode中Run即可。
open ios/WeBookStore.xcworkspace/
```

#### 4. 启动应用(Android)
```shell
# 启动Packager，如果已经启动可以忽略
tdt packager start

# 通过命令行启动App
tdt run android

# 也可以在Android Studio中打开'WeBookStore/android', 
# 用Android Studio打开项目运行即可, 请确保gradle的代理配置已经如本文前面部分所述设置完成。
```
如果你的网络不好，连接maven失败，可以选择添加阿里云的maven镜像，在`WeBookStore/android/app/build.gradle`和`WeBookStore/android/build.gradle`中的 repositories 区域添加如下代码:
```
maven{ url'http://maven.aliyun.com/nexus/content/groups/public/' }
maven{ url'http://maven.aliyun.com/nexus/content/repositories/jcenter'}
maven{ url 'https://maven.google.com' }
```

恭喜你，到这里你已经成功的创建并运行了一个新的WeTrident工程。需要调试可以使用React Native官方调试工具即可，调试前请先安装最新版本Chrome，具体使用方法见： [React Nativ调试方法](https://facebook.github.io/react-native/docs/0.51/debugging)

更多文档见 [快速开始](https://webankfintech.github.io/WeTrident/docs/getting-started)

