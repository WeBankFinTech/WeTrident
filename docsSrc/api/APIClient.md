---
id: APIClient
title: APIClient
---

## APIClient Interface
#### `request`
```
request (apiConfig, body, pathParams = {}, headers = {}, options = {})
```
通过request发起请求, 

| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| apiConfig | object | 见 [apiConfig定义](/WeTrident/docs/api/APIClient#apiconfig) | 
| body | object | http请求的body，get请求的params, post请求的body | 
| pathParams | object | 用于处理带动态参数的path，例如apiConfig.url为 /book/:id, pathParams为 `{id: 888}`时，对应的请求路径为 `/book/888` | 
| headers | object | 当前请求需要自定义的header内容 |
| options | object | 见 [options定义](/WeTrident/docs/api/APIClient#options)  

##### Params Definition
###### apiConfig
| 字段名 | 说明 | 是否必须 | 
| --- | --- | --- |
| desc | API的描述,可以用于调试日志/数据分析 | 是 | 
| baseURL | API的baseURL | 是 | 
| url | API的接口路径，和baseURL拼接成完成的API路径哦 | 是 | 
| mockable | 表示此接口是否直接返回mock数据 | 否
| request | API的请求结构 | 否
| response | API的响应结构，用于定义Mock的响应 | 否

###### options
| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| cacheMaxAgeInMs | number | 缓存有效时间，该设置只对当次请求有效

<br />

#### `addHeaders`
```
addHeaders (headers, method, match = /.*/)
```
添加自定义header，可以控制只给部分 http method 的请求添加，同时只对url满足 match 参数设定规则的请求添加。

| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| headers | object | 需要添加的header
| method | string | ['put', 'post', 'patch', 'delete']中的某个值
| match | RegExp | 用于匹配URL的正则，确保只有满足规则的请求才会添加对应的Header

<br />

#### `setHeaders`
同 `addHeaders`, 差别在于该API会覆盖所有默认配置，所有Header由开发则自行设定.

<br />

#### `setRequestTimeoutInMs`
```
setRequestTimeoutInMs (timeout)
```
设置默认的请求超时时间。

<br />

#### `setDefaultCacheMaxAgeInMs`
```
setDefaultCacheMaxAgeInMs (defaultCacheMaxAgeInMs)
```
设置默认的缓存失效时间。
