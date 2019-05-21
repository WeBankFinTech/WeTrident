'use strict'

import Interceptor from './Interceptor'
export default class LogInterceptor extends Interceptor {
  requestInterceptor (request, response) {
    // TODO debug control
    console.log('<<<<<<<<<<<<<<<<<<<< Request')
    console.log(request)
  }

  responseInterceptor (request, response) {
    // TODO debug control
    console.log('>>>>>>>>>>>>>>>>>>>> Response')
    console.log(response)
  }
}
