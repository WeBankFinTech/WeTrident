'use strict'

/**
 * Interceptor interface for Request and Response
 */
export default class Interceptor {
  requestInterceptor () {
    throw new Error('Do not call abstract method foo from child.')
  }
  responseInterceptor () {
    throw new Error('Do not call abstract method foo from child.')
  }
}
