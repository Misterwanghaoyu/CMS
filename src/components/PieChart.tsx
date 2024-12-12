import React from 'react'
import { useEffect,useRef } from "react";
import * as echarts from "echarts";
export default function PieChart() {
  const chartRef = useRef(null);
  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    chartInstance.setOption(option);

  }, [])
  return (
    <div style={{ textAlign: "center" }}>


      <div ref={chartRef} style={{ height: "400px" }}></div>


    </div>
  )
}
