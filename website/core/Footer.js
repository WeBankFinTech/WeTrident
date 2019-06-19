/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react')

class Footer extends React.Component {
  render () {
    return (
      <footer className="nav-footer" id="footer">
        {/*<a*/}
        {/*  href="https://opensource.facebook.com/"*/}
        {/*  target="_blank"*/}
        {/*  rel="noreferrer noopener"*/}
        {/*  className="fbOpenSource">*/}
        {/*  <img*/}
        {/*    src={`${this.props.config.baseUrl}img/oss_logo.png`}*/}
        {/*    alt="Facebook Open Source"*/}
        {/*    width="170"*/}
        {/*    height="45"*/}
        {/*  />*/}
        {/*</a>*/}
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    )
  }
}

module.exports = Footer
