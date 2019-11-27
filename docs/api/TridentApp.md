---
id: TridentApp
title: TridentApp
---

TridentApp中完成了Trident的主要功能，导航和状态数据管理都由它完成，同时TridentApp也保留了一些扩展性，支持部分属性的用户自定义。

| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| headers | object | 需要添加的header
| method | string | ['put', 'post', 'patch', 'delete']中的某个值
| match | RegExp | 用于匹配URL的正则，确保只有满足规则的请求才会添加对应的Header

