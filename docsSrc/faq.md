---
id: faq
title: 常见问题
---

### 1. 安装了高版本 node，为什么 Xcode 检查 node 版本不通过？

很有可能是你本地安装了多个版本的 node。

我们会默认读取 `/usr/local/bin`路径下的 node 版本。如果 `~/.bash_profile` 存在，里面导出的 PTAH 会覆盖 `/usr/local/bin` 路径。

当 node 版本检查不通过时，Xcode 会打印当前在 bash 中 node 的路径，如

```sh
node version 8.14.1 is required, please update your node version, current version is 6.11.3 (/usr/local/bin/node) 
```

#### 🔑 解决方法

将高版本的 node 路径添加至`~/.bash_profile`中

```
# 1. 查看 node 指向，如 /Users/tdt/.nvm/versions/node/v8.14.1/bin/node
which node

# 2. 在 .bash_profile 中添加下面这句，注意将下面的 node 路径改为你本地的路径！
export PATH=/Users/tdt/.nvm/versions/node/v8.14.1/bin:$PATH
```