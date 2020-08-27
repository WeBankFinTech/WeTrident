declare module '@webank/trident' {
  interface AppNavigator {
    example: {
      FrameworkScene(): void
      NavAScene(): void
      NavBScene(): void
      NavCScene(): void
      NavigationScene(): void
      NetworkScene(): void
      PluginStoreScene(): void
      StateKeyHomeScene(): void
      StateKeyScene(...args): void
      StateManagementScene(): void
      StateShareScene(): void
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
