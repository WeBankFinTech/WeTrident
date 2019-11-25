# 1 使用代码自动补全

## bash命令行

### 1. 首先brew安装 bash-completion

```bash
$ brew install bash-completion
```

### 2. 移动自动补全文件到指定目录

将自动补全文件`auto-tab-bash.sh`移动到`/usr/local/etc/bash_completion.d/`


### 3. 运行以下命令

```bash
echo "[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion" >> ~/.bash_profile
```

## zsh命令行

### 添加以下命令到`~/.zshrc`

```bash
# folder of all of your autocomplete functions
fpath=($HOME/.oh-my-zsh/completions $fpath)

# enable autocomplete function
autoload -U compinit
compinit
```

### 2. 移动自动补全文件到指定目录

将自动补全文件`auto-tab/_tdt.sh`移动到`$HOME/.oh-my-zsh/completions/`下

### 3. 运行`source ~/.zshrc`并重启terminal


### 若上述步骤没有生效

在`.oh-my-zsh/oh-my-zsh.sh`中找到`:${ZSH_DISABLE_COMPFIX:=true}`，将`true改为false`，执行`source ~/.zshrc`，重启terminal
