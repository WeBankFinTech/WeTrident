/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  // {
  //   caption: 'User1',
  //   // You will need to prepend the image path with your baseUrl
  //   // if it is not '/', like: '/test-site/img/image.jpg'.
  //   image: '/img/undraw_open_source.svg',
  //   infoLink: 'https://www.facebook.com',
  //   pinned: true,
  // },
];

const siteConfig = {
  title: 'Trident', // Title for your website.
  tagline: '可快速开发支持商业运营App的框架',
  // url: 'https://your-docusaurus-test-site.com', // Your website URL
  baseUrl: '/trident/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'trident-website',
  organizationName: 'WeBank App Team',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'getting-started', label: '使用文档'},
    {href: 'http://git.weoa.com/app/trident', label: '源码库(开发网)'},
    {href: 'http://git.weoa.com/app/trident-demo', label: '示例工程(开发网)'},
    {href: 'http://km.weoa.com/group/FullStackFE', label: '开发团队'},
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  headerIcon: 'img/trident-icon-white.png',
  footerIcon: 'img/trident-icon-white.png',
  favicon: 'img/trident-icon.png',

  /* Colors for website */
  colors: {
    primaryColor: '#1E53A4',
    secondaryColor: '#382553',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} WeBank App Team`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'atom-one-light',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    "./scripts/codeblock.js",
    "./scripts/buttons.js",
    "./scripts/mta.js"
  ],

  // Add custom stylesheets here
  stylesheets: [
    // './css/monokai.min.css',
    // './css/codeblock.css',
    // './css/default.min.css'
  ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph and Twitter card images.
  // ogImage: 'img/undraw_online.svg',
  // twitterImage: 'img/undraw_tweetstorm.svg',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;
