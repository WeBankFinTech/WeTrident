---
id: TridentApp
title: TridentApp
---

TridentApp中完成了Trident的主要功能，导航和状态数据管理都由它完成，同时TridentApp也保留了一些扩展性，支持部分属性的用户自定义。

| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| navigationConfig | object | 配置导航相关的参数，配置参见[react-navigation 1.x导航配置](https://reactnavigation.org/docs/en/1.x/header-buttons.html)
| modules | array | 通常情况保持创建项目以后的值即可，无需改动
| dyModules | array | 通常情况保持创建项目以后的值即可，无需改动
| showWTConsole | bool | 是否需要显示WTConsole，WTConsole可用于App内日志采集和上传
| wtConsoleOptions | object | 见 [wtConsoleOptions 定义](/trident/docs/api/TridentApp#wtconsoleoptions)
| match | RegExp | 用于匹配URL的正则，确保只有满足规则的请求才会添加对应的Header

##### wtConsoleOptions
| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| logServerUrl | string | wt-console-server部署以后可供上传的服务器地址
| maxLogLine | number | 本地缓存的日志条数最大值
| ignoreFilter | function | 自定义的日志定义规则，用户可以根据传入的日志来确定是否展示到WTConsole
