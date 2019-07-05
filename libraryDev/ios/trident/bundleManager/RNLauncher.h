//
//  RNLauncher.h
//  Develop
//
//  Created by Eric Hua on 2019/7/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNLauncher : NSObject
+ (instancetype)shareInstance;
- (NSURL *) bundleRootPath;
@end

NS_ASSUME_NONNULL_END
