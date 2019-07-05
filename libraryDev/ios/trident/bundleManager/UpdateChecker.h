//
//  UpdateChecker.h
//  Readhub
//
//  Created by erichua on 31/03/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <SSZipArchive.h>
@interface UpdateChecker : NSObject


// check update + download + verify
+ (void) checkUpdate: (NSString *) updateConofigURL
       completion: (void (^)(NSString * updateConofigURL, NSError * error)) completion;

+ (void) download: (NSString *) downloadUrl
       completion: (void (^)(NSString * downloadFilePath, NSError * error)) completion;

+ (void) install: (NSString *) zipFilePath
targetPackageVersion:(NSString *) targetPackageVersion
      completion: (void (^)(NSString * packagePath, NSError * error)) completion;

+ (NSURL *) getEntryFilePath;
@end
