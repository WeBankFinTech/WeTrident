---
id: AppNavigator
title: AppNavigator
---

### `goBack`

返回routeNames指定的页面，不传递参，默认返回上一页面。

| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| routeNames | array | 返回的目标页面名称，支持多个候选页面 | 


#### 说明及示例
```
1.假设页面堆栈为 A->B->C->D
- 在 D 页面调用 goBack() 返回 C
- 在 D 页面调用 goBack('B') 返回 B

2.假设页面 D 是一个公共页面，存在多种路径跳转过来：A->B->C->D, E->F->D
- 在 D 页面调用 goBack(['A', 'E'])，如果从 A 跳转过来返回 A，如果从 E 条转过来返回 E

提示：为了避免字面值，推荐使用 AppNavigator.home.HomeScene 替代 'HomeScene' 字面值
```

###  `goBackThenPush`
返回指定页面，然后跳转到新页面

| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| routeNames | array | 返回的目标页面名称，支持多个候选页面 | 
| newRouter | string | 返回后要到达的页面 | 

#### 说明及示例
```
1)假设页面路径如下，D 页面有多重可能的返回路径：
A -> C -> D
A -> E -> D
变为：
A -> B
现在需要从 D 页面返回 B 页面，调用 goBackThenPush(A, B)

2)假设页面路径如下，E 页面存在多重返回路径：
A -> B -> C -> D -> E
A -> F -> G -> H
A -> I -> J
现需要从 E、H、J 页面返回到对应的 B、F、I 页面，然后跳转到统一的K页面，变成：
A -> B -> K
A -> F -> K
A -> I -> K
则调用 AppNavigator.goBackThenPush([B, F, I], K)
```

###  `goBackAndReplace`
返回指定页面，并使用新页面替换

| 参数名 | 类型 | 描述 | 
| --- | --- | --- |
| routeNames | array | 返回的目标页面名称，支持多个候选页面 | 
| newRouter | string | 返回后要替换的页面 | 

#### 说明及示例
```
1）假设页面路径可能为：
A -> C -> D
A -> B
现在需要从 D 页面返回 B 页面，调用 goBackAndReplace(C, B)

2)假设页面路径如下，D 页面有多重可能的返回路径：
A -> C -> D
A -> E -> D
A -> B
现在需要从 D 页面返回 B 页面，调用 goBackAndReplace([C, E], B)

3)假设页面路径如下，E 页面存在多重返回路径：
A -> B -> C -> D -> E
A -> C -> D -> E
A -> D -> E
现需要从 E 页面返回 F 页面，把 A 和 E 之间的栈清理掉，变成：
A -> F -> E
则调用 AppNavigator.goBackAndReplace([B, C, D], F), B, C, D之间存在顺序上的优先级
```




