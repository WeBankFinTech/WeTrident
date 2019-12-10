declare module '@webank/trident' {
  interface AppNavigator {
    example: {
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
      TabContainerScene(): void
    },
    tabExample: {
      TabContainerScene(): void
    },
    tridentPluginFeedback: {
      FeedbackScene(): void
    },
    tridentPluginWebView: {
      WebViewScene(): void
    },
    ui: {
      UIScene(): void
    },

  }
}
