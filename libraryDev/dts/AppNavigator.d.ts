declare module '@webank/trident' {
  interface AppNavigator {
    example: {
      BechcheckScene(): void
      DemoScene(): void
      FrameworkScene(): void
      NavAScene(): void
      NavBScene(): void
      NavCScene(): void
      NavigationScene(): void
      NetworkScene(): void
      PluginStoreScene(): void
      StateManagementScene(): void
      StateShareScene(): void
    },
    tridentPluginWebView: {
      WebViewScene(): void
    },
    ui: {
      UIScene(): void
    },

  }
}
