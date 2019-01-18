/**
 * 主要负责用户交互逻辑，
 * 用户的交互产生的状态数据通过actions记录到store上，
 * 获取后台的数据需要通过actions或者Service(取决于是否需要记录到store)，避免在Scene里面直接调用后台
 *
 * Created by sines on 2018-02-23T10:25:07.640Z.
 */
import React from 'react'
import { WeBaseScene } from 'apps/webankPro/bizComponents'
import connect from './actionsReducer'
import ChartView from 'react-native-highcharts'

// import PropTypes from 'prop-types'
// import ChartExampleService from './ChartExampleService'
// import {AppNavigator} from 'apps/webankPro/navigation'

class ChartExampleScene extends WeBaseScene {
  render () {
    // 如果在 config 中用到了 Highchart，这里就必须定义这个变量
    const Highcharts = 'Highcharts'
    const conf = {
      chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {
            // set up the updating of the chart each second
            let series = this.series[0]
            setInterval(function () {
              let x = (new Date()).getTime() // current time
              let y = Math.random()
              series.addPoint([x, y], true, true)
            }, 1000)
          }
        }
      },
      title: {
        text: 'Live random data'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: 'Value'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            Highcharts.numberFormat(this.y, 2)
        }
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: 'Random data',
        data: (function () {
          // generate an array of random data
          let data = []
          let time = (new Date()).getTime()
          for (let i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random()
            })
          }
          return data
        }())
      }]
    }

    const options = {
      global: {
        useUTC: false
      },
      lang: {
        decimalPoint: ',',
        thousandsSep: '.'
      }
    }

    return (
      <ChartView
        style={{height: 300}} // 自定义样式
        config={conf} // highchart config
        options={options} // highchart options
        baseUri={'proWeb'} // js 库文件存放的目录，
        libsUri={['highstock.js']} // highstock.js highcharts.js highcharts-more.js
        constructMethod={ChartView.ConstructMethod.STOCK_CHART} // stockChart 或者 charts 方法， highstock 库使用 STOCK_CHART 方法构造，highcharts 库使用 CHART 方法构造
      />
    )
  }
}

export default connect(ChartExampleScene)
