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
//    接入SDK以后放开
//    NSString * packageEntryFilePath = [NSString stringWithFormat: @"%@/packages/%@/main.jsbundle", docDir, targetPackageVersion];
//    rnBundleRootURL = [NSURL URLWithString:packageEntryFilePath];
  }
  
  [UpdateChecker checkUpdate:@"http://trident.webank.com/update/config.json" completion:^(NSString *updateConofigURL, NSError *error) {
    if (error) {
      NSLog(@"JSON Error: %@", error);
    } else {
      NSLog(@"JSON: %@", updateConofigURL);
    }
  }];

//  [UpdateChecker checkUpdate:@"" completion:<#^(NSString *updateConofigURL, NSError *error)completion#>:^(NSURLSessionTask *task, id responseObject) {
//    NSLog(@"JSON: %@", responseObject);
//  } failure:^(NSURLSessionTask *operation, NSError *error) {
//    NSLog(@"Error: %@", error);
//  }];
  
  return rnBundleRootURL;
}

  //    如果已存在
//  if([[NSFileManager defaultManager] fileExistsAtPath:packageEntryFilePath]){
//    NSLog(@"RN js bundle 存在: %@",packageEntryFilePath);
//    return [NSURL URLWithString:packageEntryFilePath];
//  }else{
//    NSLog(@"RN load error!path: %@",packageEntryFilePath);
//    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//  }
  
  //- (void) prepareHnwResource {
  //    NSString * docDir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
  //    NSString * targetPackageVersion = [[NSUserDefaults standardUserDefaults] objectForKey:RUNNING_VERSION_KEY];
  //
  //    NSString * packageEntryFilePath = [NSString stringWithFormat: @"%@/packages/%@/main.jsbundle", docDir, targetPackageVersion];
  //
  ////    如果已存在
  //    if([[NSFileManager defaultManager] fileExistsAtPath:packageEntryFilePath]){
  //      NSLog(@"RN js bundle 存在: %@",packageEntryFilePath);
  //      return [NSURL URLWithString:packageEntryFilePath];
  //    }else{
  //      NSLog(@"RN load error!path: %@",packageEntryFilePath);
  //      return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  //    }
  
  //  BOOL isDebug = NO;
  //#ifdef DEBUG
  //  isDebug = YES;
  //#endif
  //  RNResourceInstaller* installer = [RNResourceInstaller sharedInstance];
  //  if (IS_TEST_ENV || (!IS_TEST_ENV && isDebug)) {
  //    // 开发过程中一旦安装了测试版, 就删除之前记录的正式版本号, 避免再次安装正式版时版本错乱
  //    [installer removeLocalRNResourceCurrentVersion];
  //  }
  //
  //  if (![installer hasCurrentRNResourceVersion]) {
  //    NSLog(@"start prepareHnwResource 1");
  //    [self installRNResourceFromNative];
  //  } else if ([[installer CurrentRNResourceVersion] integerValue] < [[installer RNResourceVersionInNative] integerValue]) {
  //    NSLog(@"start prepareHnwResource 2");
  //    [self installRNResourceFromNative];
  //  }
  //  else {
  //    NSString *entryFile = @"index.ios";
  //    NSURL *bundleLocationURL = [RNResourceHelper getBundlePath:entryFile];
  //    NSString *bundleLocation = bundleLocationURL ? bundleLocationURL.absoluteString : @"";
  //    BOOL jsExist = [[NSFileManager defaultManager] fileExistsAtPath:bundleLocation];
  //
  //    if(!jsExist) {
  //      [self installRNResourceFromNative];
  //
  //      NSDictionary *mtainfo = @{
  //                                @"bundleLocation": bundleLocation,
  //                                @"CurrentRNResourceVersion": [installer CurrentRNResourceVersion]
  //                                };
  //      [MTAUtils trackCustomKeyValueEventProxy:@"jsBundleError" props:mtainfo];
  //    }else {
  //      [self.delegate onHnwResourceReady];
  //    }
  //  }
  //}
@end
