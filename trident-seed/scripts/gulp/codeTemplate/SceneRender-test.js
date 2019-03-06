/* eslint-disable no-undef */
/**
 * Created by {{author}} on {{createTime}}.
 */
import React from 'react'
import TestRenderer from 'react-test-renderer'
import WeBankPro from 'apps/webankPro'

import {{sceneName}} from 'apps/webankPro/modules/{{moduleName}}/{{sceneName}}'

test('{{sceneName}} render', () => {
  TestRenderer.create(
    <WeBankPro renderTestScene={() => {
      return <{{sceneName}} />
    }} />
  )
})
