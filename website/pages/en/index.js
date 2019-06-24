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
            <Button href={'http://git.weoa.com/app/trident'}>
              源代码
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
        padding={props.padding || ['bottom', 'top']}
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

    const Features1 = () => (
      <Block layout="fourColumn" className="rowContainer featureBlock">
        {[
          {
            content: "定义统一规范的路由规则，配套的页面生命周期，让App的生命周期管理变得更加简单，明确模块间依赖关系",
            //image: imgUrl('icon/time.png'),
            image : imgUrl("iconfinder_network1_216674.svg"),
            imageAlign: 'top',
            title: "统一的路由体系"
          },
          {
            content: "明确定义横向模块划分和纵向的分层，用规范抹平个体差异，从项目开始的那一刻保持高内聚低耦合，降低理解和维护代码成本。",
            image: imgUrl('cubes-solid.svg'),
            imageAlign: 'top',
            title: "科学的分层结构"
          },
          {
            content: "三层数据隔离和共享机制的设计，让数据的隔离变得自然，共享变得简单，从设计上避免了数据管理混乱导致的Bug。",
            image: imgUrl('iconfinder_40_Control_setting_Gear_setting_4308040.svg'),
            imageAlign: 'top',
            title: "清晰的状态管理"
          },
          {
            content: `以日志为核心都调试思路，统一处理调试需要的日志，让开发者这可更关注与业务Bug的调试`,
            image: imgUrl('noun_debugging_1978252.svg'),
            imageAlign: 'top',
            title: "丰富的调试支持"
          }
        ]}
      </Block>
    );
    const Features2 = () => (
      <Block layout="fourColumn" className="rowContainer featureBlock" padding={['bottom']}>
        {[
          {
            content: `[敬请期待] 集成App自动化测试能力，轻松搞定App的e2e自动化测试，让开发者将精力用于设计测试用例而不是处理自动化测试环境。`,
            image: imgUrl('auto_test.svg'),
            imageAlign: 'top',
            title: "自动化测试"
          },
          {
            content: `[敬请期待] 版本管理、数据上报、推送等App必备运营能力，通常在App正式上线前焦头烂额，使用Trident这些都无需开发者单独开发。`,
            image: imgUrl('iconfinder-icon.svg'),
            imageAlign: 'top',
            title: "集成App运营能力"
          },
          {
            content: `[敬请期待] 除了基础的开发支持和运营能力，Trident同样支持公用业务模块的插件化集成，快速接入已有插件或者在团队内不同项目共享业务模块都变得异常轻松。`,
            image: imgUrl('iconfinder_8-electronic-plugin-cable-icon_2419804.svg'),
            imageAlign: 'top',
            title: "插件式业务模块"
          },
          {
            content: `[敬请期待] 一款成熟在线上运营的App一定会有线上错误监控、页面性能、接口性能等监控体系，开发者用Trident开发出来的App将会从出生那一刻起自带这些监控。`,
            image: imgUrl('noun_Check_1870817.svg'),
            imageAlign: 'top',
            title: "质量监控体系"
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
            <Features1 />
            <Features2 />
          </Container>
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
