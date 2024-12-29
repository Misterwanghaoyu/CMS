import React from 'react'
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
interface LineChartProps {
  style?: React.CSSProperties;
}
const LineChart: React.FC<LineChartProps> = ({ style }) => {
  const chartRef = useRef(null);

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
      xAxis: {
        type: 'category',
        data: ['18D', '19D', '20D', '21D', '22D', '23D', '24D']
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
          data: [20, 30, 15, 80, 70, 60, 20]
        },
        {
          name: '检材总容量',
          type: 'line',
          yAxisIndex: 1,
          data: [60, 80, 40, 60, 30, 70, 20]
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

  
    
  }, [])

    return <div ref={chartRef} style={{ height: '300px',  ...style }} />;
  
}
export default LineChart;
