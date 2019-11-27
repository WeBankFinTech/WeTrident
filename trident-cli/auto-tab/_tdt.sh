#compdef tdt
typeset -A opt_args

_arguments -C \
  '1:cmd:->cmds' \
  '2:: :->args' \
&& ret=0

case "$state" in
  (cmds)
     local commands; commands=(
      'init:init project'
      'env:check the environment required for the project'
      'help:output usage information'
      'gen:generation code'
      'packager:start remote packager'
      'release:release package'
      'install:install dependencies'
      'run:run project'
      'plugin:install plugin'
     )

      _describe -t commands 'command' commands && ret=0
  ;;
  (args)
    case $line[1] in
      (gen)
        local commands; commands=(
          'module:generation a module code'
          'scene:generation a scene code'
        )
        _describe -t commands 'gen' commands && ret=0
      ;;
      (packager)
        local commands; commands=(
          'start:start remote packager'
        )
        _describe -t commands 'packager' commands && ret=0
      ;;
      (release)
        local commands; commands=(
          'android:run android project'
          'ios:run ios project'
        )
        _describe -t commands 'release' commands && ret=0
      ;;
      (plugin)
        local commands; commands=(
          'add:add plugin'
          'publish:publish plugin'
          'init:'
        )
        _describe -t commands 'plugin' commands && ret=0
      ;;
    esac
  ;;
esac

return 1
