---
id: state-management
title: 数据状态管理
---

我们会把App数据统一管理起来，Trident中通过redux来做数据状态的管理。并且设计了一套固定的数据状态隔离和共享的方案来解决redux store上数据管理混乱的问题。

## 数据的隔离和共享
Redux提供来足够的数据共享能力，但是所有数据在一个store上，既提供了方便，又带来了危害，redux的store本质上仍然是一个全局变量，虽然通过固定的数据流来维护数据，但是始终无法完全摆脱全局变量多处共同维护和使用一份数据导致的问题。想象一下，如果整个App有上百个页面，所有共享数据均无规则存储在store上，那将会是一番如何混乱的景象。

Trident对store上的数据结构和层次做了明确的区分，以求在隔离和共享之间找到最佳的折中点。与我们的目录结构类似，store上的数据结构也分为了三层：`global`、`modulePrivate`和`scene`。

`global`为全局共享数据，这些数据可以供所有模块的页面读取，维护global数据对应的action也可绑定到Scene以支持页面内刷新全局数据。

`modulePrivate`为模块内私有数据，这些数据仅仅可以在同一个模块内的不同页面间共享，`modulePrivate`上数据对应的action也可绑定到Scene以支持页面内刷新模块内共享数据。

Scene级别的数据为页面私有数据，其他页面无法共享，如果需要传递可以使用传参跳转的方式实现。

通过上述层次划分，使用过程中，按 scene -> modulePrivate -> global的顺序去存放数据，尽可能让数据的访问范围变小。


## 存放数据到Scene数据区
定义更新数据需要的actions到Scene作用域。
``` js
  // modules/book/BookListScene/index.js
  /**
   * 定义scene级别的actions
   */
  actions: {
    updateBookList: v => v
  },
  /**
   * 定义scene级别的reducer
   */
  reducers: {
    updateBookList: (state, action) => ({
      ...state,
      bookList: action.payload
    })
  },
```

使用 action 更新数据到store。
``` js
  // modules/book/BookListScene/BookListScene.js
  componentDidMount () {
    this.props.updateBookList([
      {
        'title': '经济学原理',
        'author': '曼昆',
        'coverURL': 'https://img3.doubanio.com/view/subject/l/public/s3802186.jpg',
        'publishTime': '2009-4-1',
        'pages': 540,
        'ISBN': '9787301150894'
      },
      {
        'title': '失控-全人类的最终命运和结局',
        'author': '[美] 凯文·凯利 ',
        'coverURL': 'https://img3.doubanio.com/view/subject/l/public/s4554820.jpg',
        'publishTime': '2010-12',
        'pages': 707,
        'ISBN': '9787513300711'
      }
    ])
  }
```

调用完成可以看到日志如下，bookList更新到了新的`next state`上。
![](assets/images/2019-06-24-02-13-31.png)
`bookList`会默认挂到`BookListScene`的`this.props` 上。

上面截图中我们可以看到整个App的state store的结构：
![](assets/images/2019-06-24-02-21-04.png)
图中可以看的出，Trident App的模块数据独立于其他模块，页面数据也独立其他页面的数据。

接着我们使用这些数据来填充界面，可以直接通过 `this.props` 使用bookList
``` js
// modules/book/BookListScene/BookListScene.js
  render () {
    return (
      <View>
        {(this.props.bookList || []).forEach(bookInfo => {
          return <BookListItem bookInfo={bookInfo} />
        })}
      </View>
    )
  }
```

上面这种方式需要开发者对自己写很多特定的action/reducer，trident的scene默认提供了setSceneState函数，可以快速的在当前Scene的数据区存放数据，例如上面更新数据的例子可以写为： 
``` js
// modules/book/BookListScene/BookListScene.js
componentDidMount () {
  this.props.setSceneState({
    bookList: [
      {
        'title': '经济学原理',
        'author': '曼昆',
        'coverURL': 'https://img3.doubanio.com/view/subject/l/public/s3802186.jpg',
        'publishTime': '2009-4-1',
        'pages': 540,
        'ISBN': '9787301150894'
      },
      {
        'title': '失控-全人类的最终命运和结局',
        'author': '[美] 凯文·凯利 ',
        'coverURL': 'https://img3.doubanio.com/view/subject/l/public/s4554820.jpg',
        'publishTime': '2010-12',
        'pages': 707,
        'ISBN': '9787513300711'
      }
    ]
  })
}
```

### 存放数据到 modulePrivate 区
`modulePrivate`的数据模块内私有，模块内的Scene可以共享这些数据。在我WeBookStore中，
考虑BookDetailScene中也会用到书籍列表数据，bookList 放到 BookListScene下是不够的，需要提升到`book` 模块的共享数据区。
要完成这个提升首先我们需要在module中增加一套action/reducer，然后将对应的数据绑定到使用数据的Scene即可。

```js
// modules/book/index.js
export default {
  moduleName: 'book',
  initialState: {
    // moduleCount: 0
  },
  sceneList: require('./manifest').default,
  actions: {
    updateBookList: v => v
  },
  reducers: {
    updateBookList: (state, action) => ({ ...state, bookList: action.payload })
  }
}
```


```js
// modules/book/BookListScene/index.js
export default (global, ModulePrivate) => ({
  // ...
  /**
   * 将module级别的共享数据映射到props
   */
  mapModuleState: state => ({
    bookList: state.bookList,
  }),
  /**
   * 将module级别的actions映射到props
   */
  moduleActions: {
    updateBookList: ModulePrivate.actions.updateBookList
  },
  // ...
})
```

修改 BookListScene 使用 updateBookList 更新模块数据
```js 
  // modules/book/BookListScene/BookListScene.js
  async componentDidMount () {
    this.props.updateBookList(await BookListService.requestAllBookList())
  }
```
修改完成以后可以看到数据已经存放到 `book` 模块的`modulePrivate`上, 改完以后render内不用修改。
![](assets/images/2019-06-10-15-36-10.png)

同样的在BookDetailScene中可以很容易的共享 `modulePrivate` 上的bookList。
```js
// modules/book/BookDetailScene/index.js
export default (global, ModulePrivate) => ({
  // ...
  /**
   * 将module级别的共享数据映射到props
   */
  mapModuleState: state => ({
    bookList: state.bookList,
  }),
  /**
   * 将module级别的actions映射到props
   */
  moduleActions: {
    updateBookList: ModulePrivate.actions.updateBookList
  },
  // ...
})
```
[本节代码变更内容](http://github.com/WeBankFinTech/trident-demo/compare/f-custom-navbar...f-data-from-scene-module)
