---
id: trident-ui
title: 界面开发
---

前一部分我们已经可以通过网络请求获取数据，那接下来我们为了体验更好，防止误操作，我们希望在点击`借阅`的时候弹窗提示用户确认。并且在请求后台的过程中增加Loading，如果失败显示Toast。这些弹出层的内容，因为RN原生支持得不够好，所以Trident也支持来基础的几类组件。

通过Trident提供的Dialog组件我们可以轻松的改造达到我们想要的效果。下面分别展示来Dialog、Loading、Toast的用法。
```js
// modules/book/BookDetailScene/BookDetailScene.js
render () {
  const bookDetail = (this.props.bookList || []).find(item => item.ISBN === this.params.ISBN)

  if (!bookDetail) {
    return null
  }
  return (
    <View>
      <BookDetail {...bookDetail} />
      <SimpleButton
        style={{
          marginTop: 8,
          paddingHorizontal: 8
        }}
        onPress={() => {
          const id = Dialog.show({
            texts: [`你确定借阅《${bookDetail.title}》吗？`],
            items: [
              {
                text: '确定',
                onItemPress: () => {
                  Dialog.hide(id)

                  Loading.show()
                  BookDetailService.requestBorrowBook().then(response => {
                    Loading.hide()
                    Toast.show(response.data.ret_msg)
                    AppNavigator.book.ResultScene({ISBN: this.params.ISBN})
                  }, error => {
                    Loading.hide()
                    Toast.show('network error')
                  })
                }
              },
              {
                text: '取消',
                onItemPress: () => {
                  Dialog.hide(id)
                }
              }
            ]
          })
        }} title={'借阅'} />
    </View>
  )
}
```

紧接着根据`导航系统`部分介绍的内容，补充`ResultScene`中自定义导航栏的内容，到此基础的功能已经都完成了。

接下来我们需要继续完成版本信息页面，也就是我们之前创建的`about/VersionScene`。这个页面需要获取App的版本号显示，所以需要原生模块的接入，所以我们继续学习如何在Trident项目中引入第三方带原生能力的组件。


## trident-ui介绍
trident-ui提供了基础的弹出层组件供开发者使用。可以直接通过接口调用方式显示和关闭Dialog、Toast、Loading等组件。

### Dialog
``` js
// 展示Dialog
const dialogId = Dialog.show({
  texts: [
    'Hello...',
    'Trident',
  ],
  items: [
    {
      text: 'Confirm',
      onItemPress: () => {
        // 关闭Dialog
        Dialog.hide(dialogId)
      }
    }
  ]
})

```

### Loading
``` js
// 展示Loading
Loading.show()

// 关闭Loading
Loading.hide()
```

### Toast
``` js
// 展示Toast
Toast.show('This is a Toast')
```

### WeTouchable
支持高亮、半透明、遮罩等效果的按压态组件。

