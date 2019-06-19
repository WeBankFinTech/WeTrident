---
id: network
title: 使用网络
---

### 配置及调用
Trident 推荐将服务器端的API统一管理，相比于把api接口直接零散的写入代码，配置的方式可以为后续针对接口的数据分析提供诸多便利。Trident中网络的配置如下: 

``` js
// modules/book/cgi/index.js
export default {
  requestBookList: {
    baseURL: 'https://www.mocky.io/',
    url: '/v2/5cedf70f300000bd1f6e97fd',
    desc: '请求书籍列表',
  }
}
```
Trident App中建议统一管理后台的API，每个模块强相关的后台API，都放到 `modules/$moduleName/cgi/`目录统一管理，并且通过配置都方式配置每个API需要的信息。
主要出于如下几点考虑： 
1. 统一的存放方便后期维护
2. 统一的配置格式要求每个接口要填写一些关键字段，方便以后理解。所有字段的说明如下： 

| 字段名 | 说明 | 是否必须 | 
| --- | --- | --- |
| desc | API的描述,可以用于调试日志/数据分析 | 是 | 
| baseURL | API的baseURL | 是 | 
| url | API的接口路径，和baseURL拼接成完成的API路径哦 | 是 | 
| mockable | 表示此接口是否直接返回mock数据 | 否
| request | API的请求结构 | 否
| response | API的响应结构，用于定义Mock的响应 | 否

定义完接口以后，我们在BookListScene中通过`APIClient`使用此接口。
``` js
// modules/book/BookListScene/BookListScene.js
export default class BookListScene extends Component {
  // ...
  componentDidMount () {
    // 请求
    APIClient.request(CGI.requestBookList, {
      start: 0,
      pageSize: 10
    }).then(response => {
      console.log(response)
    }, error => {
      console.warning(error)
    })
  }
```


### 使用Mock
开发过程中，可能会需要再服务器端接口开发完之前开始开发前端，为了解决没有接口可用的问题，Trident支持了mock的功能，只需要简单的再接口配置中配置mock的返回即可，例如上面的拉去书籍列表的接口如下配置以后即可支持mock，`APIClient`发出请求以后会直接返回mock数据。response是一个数组，这个数组里面的内容随机返回，用于模拟调试失败或者多种返回数据的情况。
```javascript
// WeBookStore/src/core/modules/book/cgi/index.js
import AxiosMocker from '@webank/trident/library/network/AxiosMocker'
export default {
  requestBookList: {
    baseURL: 'https://www.mocky.io/',
    url: '/v2/5cf4c6622f00003a0e4f0453',
    desc: '请求书籍列表',

    // set true to return mock data for this api
    mockable: true,
    request: {},
    response: [
      // mock network error
      AxiosMocker.networkError(),
      // mock network timeout
      AxiosMocker.timeout(),
      // mock a normal response, it show the normal response data structure too
      AxiosMocker.success([
        {
          title: '经济学原理',
          author: '曼昆',
          coverURL: 'https://img3.doubanio.com/view/subject/l/public/s3802186.jpg',
          publishTime: '2009-4-1',
          pages: 540,
          ISBN: '9787301150894'
        },
        {
          title: '失控-全人类的最终命运和结局',
          author: '[美] 凯文·凯利 ',
          coverURL: 'https://img3.doubanio.com/view/subject/l/public/s4554820.jpg',
          publishTime: '2010-12',
          pages: 707,
          ISBN: '9787513300711'
        }
      ])
    ]
  }
}
```

