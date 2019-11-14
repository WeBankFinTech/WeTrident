//
//  RNLauncher.m
//  Develop
//
//  Created by Eric Hua on 2019/7/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "RNLauncher.h"
#import "UpdateChecker.h"

#define RUNNING_VERSION_KEY @"RUNNING_VERSION_KEY"

@implementation RNLauncher

+ (instancetype)shareInstance {
  static RNLauncher *rnLauncher;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    rnLauncher = [[self alloc] init];
  });
  return rnLauncher;
}

- (NSURL *) bundleRootPath {
  NSString * docDir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
  NSString * targetPackageVersion = [[NSUserDefaults standardUserDefaults] objectForKey:RUNNING_VERSION_KEY];
  
  NSURL * rnBundleRootURL;
  // 如果NSDefault里没有存VersionCode，直接用原生包里面的bundle
  if (!targetPackageVersion) {
    // 直接用原生包里面的bundle
    rnBundleRootURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  } else {
    rnBundleRootURL = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  }
  return rnBundleRootURL;
}
@end
