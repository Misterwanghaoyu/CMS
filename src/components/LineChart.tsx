import React from 'react'
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
interface LineChartProps {
  style?: React.CSSProperties;
  data: {
    date: string[],
    total: number[],
    totalCapacity: number[]
  }
}
const LineChart: React.FC<LineChartProps> = ({ style, data }) => {
  const chartRef = useRef(null);
  const { date, total, totalCapacity } = data
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['检材总数', '检材总容量']
      },
      dataZoom: [
        {
          type: 'slider', // 滑动条型数据缩放组件
          xAxisIndex: 0,  // 控制x轴
          start: 0,       // 数据窗口范围的起始百分比
          end: 100        // 数据窗口范围的结束百分比
        },
        {
          type: 'inside', // 内置型数据缩放组件
          xAxisIndex: 0,  // 控制x轴
          start: 0,
          end: 100,
          zoomOnMouseWheel: true  // 支持鼠标滚轮缩放
        }
      ],
      xAxis: {
        type: 'category',
        data: date
      },
      yAxis: [
        {
          type: 'value',
          name: '检材总数',
          min: 0
        },
        {
          type: 'value',
          name: '容量(MB)',
          min: 0
        }
      ],
      series: [
        {
          name: '检材总数',
          type: 'line',
          data: total
        },
        {
          name: '检材总容量',
          type: 'line',
          yAxisIndex: 1,
          data: totalCapacity
        }
      ]
    };

    

    chart.setOption(option);
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };



  }, [data])

  return <div ref={chartRef} style={{ height: '300px', ...style }} />;

}
export default LineChart;
