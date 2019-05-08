/**
 * 路由接口的类型定义，增强 IDE 智能提示，使用 TypeScript 编写类型定义
 *
 * 该文件是可选文件，删除或错误不会影响代码正常运行，最终也不会被打包
 */

interface AppNavigatorStatic {
  new (): AppNavigator
}

type StringLike = string | {toString(): string}

interface AppNavigator {
  /**
   * 返回指定页面
   *
   * 示例：
   * 1)假设页面堆栈为 A->B->C->D
   * * 在 D 页面调用 goBack() 返回 C
   * * 在 D 页面调用 goback('B') 返回 B
   *
   * 2) 假设页面 D 是一个公共页面，存在多种路径跳转过来：A->B->C->D, E->F->D
   * * 在 D 页面调用 goBack(['A', 'E'])，如果从 A 跳转过来返回 A，如果从 E 条转过来返回 E
   *
   * 提示：为了避免字面值，推荐使用 AppNavigator.home.HomeScene 替代 'HomeScene' 字面值
   *
   * @param routeNames 返回的目标页面名称，支持多个候选页面
   */
  goBack(routeNames?: StringLike | StringLike[]): void

  /**
   * 返回指定页面，并使用新页面替换
   *
   * 示例：
   * 1）假设页面路径可能为：
   * A -> C -> D
   * A -> B
   * 现在需要从 D 页面返回 B 页面，调用 goBackAndReplace(C, B)
   *
   * 2)假设页面路径如下，D 页面有多重可能的返回路径：
   * A -> C -> D
   * A -> E -> D
   * A -> B
   * 现在需要从 D 页面返回 B 页面，调用 goBackAndReplace([C, E], B)
   * @param routeNames 返回的目标页面名称，支持多个候选页面
   * @param {string|{routeName: string, params: any}} newRouter 新页面的路由
   *    可以是字符串（页面名称）或者是对象（必须包含routeName表示页面名称以及可选的页面参数 params）
   */
  goBackAndReplace(
    routeNames: StringLike | StringLike[],
    newRouter: StringLike | {routeName: StringLike, params?: any}
  ): void
  goBackThenPush(
    routeNames: StringLike | StringLike[],
    newRouter: StringLike | {routeName: StringLike, params?: any}
  ): void
}

declare const appNavigator: AppNavigator

export = appNavigator
