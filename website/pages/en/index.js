/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const {MarkdownBlock, GridBlock, Container} = CompLibrary; /* Used to read markdown */

const siteConfig = require(`${process.cwd()}/siteConfig.js`);

function docUrl(doc, language) {
  return `${siteConfig.baseUrl}${language ? `${language}/` : ""}${doc}`;
}

function imgUrl(img) {
  return `${siteConfig.baseUrl}img/${img}`;
}

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

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);


const ProjectTitle = () => (
  <React.Fragment>
    <div style={{display : "flex", justifyContent : "center", alignItems : "center"}}>
      {/*<img src={"img/redux.svg"} alt="Redux logo" width={100} height={100}/>*/}
      <h1 className="projectTitle">{siteConfig.title}</h1>
    </div>

    <h2 style={{marginTop : "0.5em"}}>
      一套可快速开发支持商业运营App的框架。
    </h2>
  </React.Fragment>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    const language = this.props.language || "";
    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href={docUrl("introduction/getting-started", language)}>
              快速开始
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Installation = () => (
  <div
    className="productShowcaseSection"
    style={{ textAlign: "center" }}
  >
    <h2 style={{marginTop : 10, marginBottom : 5}}>Installation</h2>
    <MarkdownBlock>
      ``` npm install --save
      redux ```
    </MarkdownBlock>
  </div>
);

const Block = props => (
  <Container
    id={props.id}
    background={props.background}
    className={props.className}
  >
    <GridBlock align="center" contents={props.children} layout={props.layout}/>
  </Container>
);

const FeaturesTop = props => (
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

const OtherLibraries = props => (
  <Container className="rowContainer">
    <h2 style={{margin : 0}}>
      Other Libraries from the Redux Team
    </h2>
  <Block layout="fourColumn" className="libBlock">
    {[
      {
        content: "Official React bindings for Redux",
        title: "[React-Redux ![link2](img/external-link-square-alt-solid.svg)](https://react-redux.js.org) "
      },
      {
        content: "A simple batteries-included toolset to make using Redux easier",
        title: "[Redux Starter Kit ![link2](img/external-link-square-alt-solid.svg)](https://redux-starter-kit.js.org)"
      },
    ]}
  </Block>
  </Container>
);

const DocsSurvey = () => (
  <Block layout="twoColumn" className="docsSurvey rowContainer">
    {[
      {
        content: "We're planning a revamp of the Redux docs content.  Please help us make the docs better by **[filling out this survey](https://docs.google.com/forms/d/e/1FAIpQLSfzIkY3fXZ8PrQKScYMK0YoEgALfAK2qQ0mOj1_ibKv2qDTuQ/viewform)**, so we can determine what changes would help the most.  Thanks!",
        title: "Help Us Improve the Redux Docs!"
      },
    ]}
  </Block>
)

class Index extends React.Component {
  render() {
    const language = this.props.language || "";

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">

          <div className="productShowcaseSection">
            <Container background="light">
              <FeaturesTop />
            </Container>
            <Container className="libsContainer" wrapper={false}>

              {/*<OtherLibraries/>*/}
              {/*<DocsSurvey />*/}
            </Container>
            <Container background="light">

            </Container>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = Index;
