/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(`${process.cwd()}/siteConfig.js`);
function docUrl(doc, language) {
  return `${siteConfig.baseUrl}${language ? `${language}/` : ""}${doc}`;
}

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}


class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    class Button extends React.Component {
      render() {
        return (
          <div className="pluginWrapper buttonWrapper">
            <a className="button hero" href={this.props.href} target={this.props.target}>
              {this.props.children}
            </a>
          </div>
        );
      }
    }

    Button.defaultProps = {
      target: "_self"
    };

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/undraw_monitor.svg`} />
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl("getting-started", language)}>
              快速开始
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Block = props => (
      <Container
        padding={['bottom', 'top']}
        id={props.id}
        background={props.background}>
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{textAlign: 'center'}}>
        <h2>Feature Callout</h2>
        <MarkdownBlock>减少20%开发时间实现更可靠的App</MarkdownBlock>
      </div>
    );

    const TryOut = () => (
      <Block id="try">
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            title: 'Wonderful SVG Illustrations',
          },
        ]}
      </Block>
    );

    const Description = () => (
      <Block background="dark">
        {[
          {
            content:
              'This is another description of how this project is useful',
            image: `${baseUrl}img/undraw_note_list.svg`,
            imageAlign: 'right',
            title: 'Description',
          },
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background="light">
        {[
          {
            content:
              'Each new Docusaurus project has **randomly-generated** theme colors.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Randomly Generated Theme Colors',
          },
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout="fourColumn" className="rowContainer featureBlock">
        {[
          {
            content: "定义统一规范的路由规则，支持按需加载，支持运营数据和异常数据的自动上报管理，配套的页面生命周期，让App的生命周期管理变得更加简单。",
            //image: imgUrl('icon/time.png'),
            image : imgUrl("noun_Check_1870817.svg"),
            imageAlign: 'top',
            title: "统一的路由管理"
          },
          {
            content: "定义统一的网络层模式，以配置的方式来实现接口定义，支持纯客户端的Mock和缓存，洁面开发阶段彻底摆脱服务器端限制。",
            image: imgUrl('cubes-solid.svg'),
            imageAlign: 'top',
            title: "完善的网络支持"
          },
          {
            content: "清晰的层次和模块划分，三层数据隔离和共享机制的设计，让数据的隔离变得自然，共享变得简单。从设计上避免了数据管理混乱导致的Bug",
            image: imgUrl('cogs-solid.svg'),
            imageAlign: 'top',
            title: "清晰的状态管理"
          },
          {
            content: `框架统一处理调试需要的基础设施，各种类型的日志明确区分，让开发这可以更专心与业务Bug的调试`,
            image: imgUrl('noun_debugging_1978252.svg'),
            imageAlign: 'top',
            title: "丰富的调试支持"
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <a href={user.infoLink} key={user.infoLink}>
            <img src={user.image} alt={user.caption} title={user.caption} />
          </a>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection paddingBottom">
          <h2>Who is Using This?</h2>
          <p>This project is used by all these people</p>
          <div className="logos">{showcase}</div>
          <div className="more-users">
            <a className="button" href={pageUrl('users.html')}>
              More {siteConfig.title} Users
            </a>
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Container background="light">
            <Features />
          </Container>
          {/*<FeatureCallout />*/}
          {/*<LearnHow />*/}
          {/*<TryOut />*/}
          {/*<Description />*/}
          {/*<Showcase />*/}
        </div>
      </div>
    );
  }
}

module.exports = Index;
