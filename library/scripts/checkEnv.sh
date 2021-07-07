#!/bin/sh
compareVersion () {
    if [[ $1 == $2 ]]
    then
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++))
    do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++))
    do
        if [[ -z ${ver2[i]} ]]
        then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]}))
        then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]}))
        then
            return 2
        fi
    done
    return 0
}

if [[ -f "${HOME}/.bash_profile" ]]; then
  source ${HOME}/.bash_profile
fi

requireNodeVersion=`cat ../.nvmrc`
currentNodeVersion=`node --version | cut -d " " -f 3 | sed -e "s/[ |v]//g"`

compareVersion $requireNodeVersion $currentNodeVersion
compareResult=$?
if [[ $compareResult == 1 ]]
then
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!  Node Version ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "node version ${requireNodeVersion} is required, please update your node version, current version is ${currentNodeVersion} "
    echo "check this link for help => https://webankfintech.github.io/WeTrident/docs/faq"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!  Node Version ERROR !!!!!!!!!!!!!!!!!!!!!!!!!!"
    exit -1
fi
