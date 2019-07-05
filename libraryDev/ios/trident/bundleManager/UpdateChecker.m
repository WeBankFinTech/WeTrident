//
//  UpdateChecker.m
//  Readhub
//
//  Created by erichua on 31/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "UpdateChecker.h"
#import <AFNetworking/AFURLSessionManager.h>
#import <AFNetworking/AFHTTPSessionManager.h>

#import "SSZipArchive.h"
#import <React/RCTBundleURLProvider.h>
#define RUNNING_VERSION_KEY @"RUNNING_VERSION_KEY"

@implementation UpdateChecker
+ (void) checkUpdate: (NSString *) updateConofigURL
          completion: (void (^)(NSString * updateConofigURL, NSError * error)) completion {
  AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
  [manager GET:updateConofigURL parameters:nil progress:nil success:^(NSURLSessionTask *task, id responseObject) {
//    NSLog(@"JSON: %@", responseObject);
//    NSLog(@"bundleURL: %@", [responseObject objectForKey:(@"bundleURL")]);
    NSString * bundleURL = [responseObject objectForKey:(@"bundleURL")];
    NSString * targetVersion = [responseObject objectForKey:(@"version")];
    
    [UpdateChecker download:bundleURL completion:^(NSString *downloadFilePath, NSError *error) {
      NSLog(@"downloadFilePath: %@", downloadFilePath);
      
      [UpdateChecker install:bundleURL targetPackageVersion:targetVersion completion:^(NSString *packagePath, NSError *error) {
        NSLog(@"packagePath: %@", packagePath);
      }];
    }];
  } failure:^(NSURLSessionTask *operation, NSError *error) {
    NSLog(@"Error: %@", error);
  }];
}


+ (void) download: (NSString *) downloadUrl
       completion: (void (^)(NSString * downloadFilePath, NSError * error)) completion {
  NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
  AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];
  
  NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:downloadUrl]];
  
  NSURLSessionDownloadTask *downloadTask = [manager downloadTaskWithRequest:request progress:nil destination:^NSURL *(NSURL *targetPath, NSURLResponse *response) {
    NSURL *documentsDirectoryURL = [[NSFileManager defaultManager] URLForDirectory:NSDocumentDirectory inDomain:NSUserDomainMask appropriateForURL:nil create:NO error:nil];
    return [documentsDirectoryURL URLByAppendingPathComponent:[response suggestedFilename]];
  } completionHandler:^(NSURLResponse *response, NSURL *filePath, NSError *error) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (error == nil) {
        NSLog(@"File downloaded to: %@", filePath);
        
        if (completion) {
          completion(filePath.path, nil);
        }
      } else {
        if (completion) {
          completion(nil, error);
        }
      }
    });
    //
    //    NSString * docDir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
    //
    //    NSString * packagePath = [NSString stringWithFormat: @"%@/packages/110/", docDir];
    //    BOOL isDir = YES;
    //    if (![[NSFileManager defaultManager] fileExistsAtPath:packagePath isDirectory:&isDir]) {
    //      [[NSFileManager defaultManager] createDirectoryAtPath:packagePath withIntermediateDirectories:YES attributes:nil error: nil];
    //    }
    //
    //    [self unzip:filePath.path targetDir:packagePath];
  }];
  [downloadTask resume];
}

+ (void) install: (NSString *) zipFilePath
     targetPackageVersion:(NSString *) targetPackageVersion
      completion: (void (^)(NSString * packagePath, NSError * error)) completion {
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    NSString * docDir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
    NSString * packagePath = [NSString stringWithFormat: @"%@/packages/%@/", docDir, targetPackageVersion];
    
    NSError *error;
    BOOL result = [SSZipArchive unzipFileAtPath:zipFilePath toDestination:packagePath overwrite: true password:nil error:&error];
    
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:targetPackageVersion forKey:RUNNING_VERSION_KEY];
    
    NSLog(@"unzipResult: %@", result ? @"TRUE":@"FALSE");
    
    dispatch_async(dispatch_get_main_queue(), ^{
      if (result) {
        if (completion) {
          completion(packagePath, nil);
        }
      } else {
        // 解压失败删除
        NSFileManager *fileManager = [NSFileManager defaultManager];

        NSError *error;
        BOOL success = [fileManager removeItemAtPath:zipFilePath error:&error];
        
        if (completion) {
          completion(nil, error);
        }
      }
    });
  });
}


+ (NSURL *) getEntryFilePath {
  NSString * docDir = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex: 0];
  NSString * targetPackageVersion = [[NSUserDefaults standardUserDefaults] objectForKey:RUNNING_VERSION_KEY];
  if (!targetPackageVersion) {
#if DEBUG
      //   原来的jsCodeLocation保留在这里
      return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
      return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
  }
//  NSString * packageEntryFilePath = [NSString stringWithFormat: @"%@/packages/%@/main.jsbundle", docDir, targetPackageVersion];
  
//  如果已存在
//  if([[NSFileManager defaultManager] fileExistsAtPath:packageEntryFilePath]){
//    NSLog(@"RN js bundle 存在: %@",packageEntryFilePath);
//    return [NSURL URLWithString:packageEntryFilePath];
//  }else{
//    NSLog(@"RN load error!path: %@",packageEntryFilePath);
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
//  }
}
@end
