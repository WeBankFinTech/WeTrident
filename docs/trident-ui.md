---
id: trident-ui
title: 界面开发
---

## trident-ui
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

### ActionSheet
    // TODO 

### WeTouchable
支持高亮、半透明、遮罩等效果的按压态组件。

