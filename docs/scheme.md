---
id: scheme
title: 外部Scheme拉起
---

## 外部拉起支持
```shell
# iOS模拟schema拉起
xcrun simctl openurl booted wbstore:///example/DemoScene?title=TestSchemaJump
```

```shell
# Android模拟schema拉起
adb shell am start -W -a android.intent.action.VIEW -d wbstore:///example/DemoScene?title=TestSchemaJump com.trident.wbstore
```