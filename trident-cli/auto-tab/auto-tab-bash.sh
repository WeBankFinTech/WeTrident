#!/usr/bin/env bash

# COMP_WORDS 类型为数组，存放当前命令行中输入的所有单词.被COMP_WORDBREAKS拆分成单词
# COMP_CWORD 类型为整数，当前输入的单词在COMP_WORDS中的索引
# COMPREPLY 类型为数组，候选的补全结果就是从这个数组
# COMP_WORDBREAKS 类型为字符串，表示单词之间的分隔符
# COMP_LINE 类型为字符串，表示当前的命令行输入字符
# COMP_POINT 类型为整数，表示光标在当前命令行的哪个位置

function _auto_tab() {
    local cur main gen packager release plugin
    COMPREPLY=()
    cur=${COMP_WORDS[COMP_CWORD]}
    main="init env help gen packager release install run plugin"
    gen="module scene"
    packager="start"
    release="android ios"
    plugin="add publish init"

    if [[ "${#COMP_WORDS[@]}" -eq 2 ]];then
        COMPREPLY=( $(compgen -W "${main}" -- ${cur}) )
    elif [[ "${COMP_WORDS[1]}" == gen ]];then
        COMPREPLY=( $(compgen -W "${gen}" -- ${cur}) )
    elif [[ "${COMP_WORDS[1]}" == packager ]];then
        COMPREPLY=( $(compgen -W "${packager}" -- ${cur}) )
    elif [[ "${COMP_WORDS[1]}" == release ]];then
        COMPREPLY=( $(compgen -W "${release}" -- ${cur}) )
    elif [[ "${COMP_WORDS[1]}" == plugin ]];then
        COMPREPLY=( $(compgen -W "${plugin}" -- ${cur}) )
    fi

}
complete -o bashdefault -o default -F _auto_tab tdt


#trident  init help env
