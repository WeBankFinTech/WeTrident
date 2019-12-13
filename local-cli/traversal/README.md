## 自动化遍历

#### 使用方法

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
> npm i
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
