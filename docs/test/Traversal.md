---
id: Traversal
title: 自动化遍历使用指南
---

## 自动化遍历

####使用方法

+ 准备工作

**Android：** 使用数据线连接

**iOS：** 运行模拟器

+ 启动server

```
tdt traversal start
```

> Q：如果启动过程中提示依赖安装失败怎么办？

> A：可以手动在traversal-server的目录下运行命令：
> ```
> wnpm i
> ```

+ 测试包

⚠️ 测试包应使用可供调试的debug版本，并启动本地调试。

> 可参考命令
> ```
> tdt packager start
> ```
> 启动本地代码调试

启动server后，打开App即可。

⚠️ 检查并确保您的App首页，或启动测试的页面是否有触发页面更新(render)的操作。

> 如测试启动的页面无触发更新的操作，会无法触发自动遍历。
> 可在页面componentDidMount方法中增加测试代码如：
> 
> ```
> this.setState({
> 	startTest: true
> })
> ```
> 强制页面更新来触发启动自动遍历。

+ 查看测试结果

测试结果存放在项目目录的records目录下，以时间命名，如**2019-10-01.txt**


### Q&A
+ Q：想要在iOS真机上运行自动化遍历怎么办？

  A：修改SceneTraversal.js```"ws://localhost:3000/..."```，将localhost替换为server的ip地址。
  
  
+ Q：如何跳过页面上的某个元素？

  A：给元素添加属性```ignoreTraversal```
  
  ***Example:***
  
  ```
  <Button ignoreTraversal text={'I\'m a Button'} onPress={() => {}} />
  ```


+ Q：如何定制遍历路径？

  A：工具提供了白名单功能，可以支持您定制的遍历路径。在项目traversal-server目录下，编辑strategy.json，添加需要遍历的module和scene的白名单。

  ***Example:***
  
  ```
  {
	"whitelist": {
		"moduleNameA": "*", // 模块下全页面白名单
		"moduleNameB": ["sceneNameA", "sceneNameB"] // 模块下指定页面白名单
	 }
  }
  ```
  
  
+ Q：如何跳过某些模块或页面不被遍历？

  A：工具提供了黑名单功能，黑名单中的模块或页面会被跳过。配置方式和白名单类似。
  
  ***Example:***
  
  ```
  {
	"blacklist": {
		"moduleNameA": "*", // 模块下全页面黑名单
		"moduleNameB": ["sceneNameA", "sceneNameB"] // 模块下指定页面黑名单
	 }
  }
  ```
  