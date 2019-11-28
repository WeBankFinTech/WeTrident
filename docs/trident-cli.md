---
id: trident-cli
title: trident-cli使用
---

## 安装/更新 CLI

```sh
wnpm install -g @webank/trident-cli
```
##### `trident-cli` 支持缩写为 `tdt`。

## Commands

- [`init`](#init)
- [`gen`](#gen)
- [`packager`](#packager)
- [`release`](#release)
- [`install`](#install)
- [`run`](#run)
- [`plugin`](#plugin)
- [`distribute`](#distribute)
- [`env`](#env)


### `init`

使用方法：

```sh
tdt init [options]
```

创建 Trident 项目，所有参数可以直接指定或以命令行问答的方式输入。

#### Options

#### `--name [string]`

项目名称。

#### `--bundleId [string]`

项目 bundle id，如 `com.trident.demo`。

#### `--scheme [string]`

项目跳转的 scheme。关于 scheme 可以了解 👉 [URL Schemes 使用详解](https://sspai.com/post/31500)。

#### `--port [number]`

> default: 8081

调试端口。

#### `--eslint [boolean]`

是否使用 eslint。

#### `--template [string]`

项目模板。目前可选`tab`: tabView模板、`default`: 空模板。

####Example

```sh
tdt init
tdt init --name=WeBookStore --bundleId=com.trident.wbstore --scheme=wbstore --template=tab

```

### `gen`

使用方法：

```sh
tdt gen module
tdt gen scene
```

#### gen module

生成模块。

#### gen scene

生成页面。

可参考[业务模块的划分](./getting-started/#业务模块的划分)。

### `packager`

使用方法：

```sh
tdt packager start
```

本地代码调试，打开一个用于实现动态代码加载的 Node 服务。

#### Options

#### `--port [number]`

调试端口，也可以通过 `trident-config.json` 的 `port` 属性进行指定。

### `release`

使用方法：

```sh
tdt release <subCmd>
```

构建 ipa/apk。

#### subCmd

##### android

Android 构建 apk。

#### ios

iOS 构建 ipa。

### `install`

使用方法：

```sh
tdt install
```

安装项目 npm 依赖与 iOS pod 依赖。


### `run`

使用方法：

```sh
tdt run <subCmd>
```

构建 ipa/apk.

#### subCmd

##### android

运行 Android 应用。

#### ios

运行 iOS 应用。

### `plugin`

业务模块插件的开发是Trident的一大特色，开发者可以将自己某个独立可公用带业务模块以`trident-plugin`的形式输出。其他用户只需要通过 trident-cli 安装此业务插件即可使用这个公用带业务能力。

#### add

```sh
tdt plugin add <pluginName>
```

安装一个插件。

#### init

```sh
tdt plugin init <moduleName>
```

将一个 module 初始化为 plugin。

`moduleName`即为需要发布为插件的模块，此命令将在模块目录下初始化`package.json`，并自动添加`README.md`，开发者可以在 README.md 中补充插件说明。

#### publish

```sh
tdt plugin publish <pluginName>
```

插件发布。

`pluginName`即为需要发布为插件的模块，此命令将抽取插件依赖更新至`package.json`，引导开发者更新插件版本号，执行插件发布。

### `distribute`

使用方法：

```sh
tdt distribute androidPack
```

构建 Android 渠道包。

### `env`

使用方法：

```sh
tdt env
```

Trident 运行环境检测。
