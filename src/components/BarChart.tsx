import React, { useState } from 'react'
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Input } from 'antd';
export default function BarChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
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
  return  <div ref={chartRef} style={{ height: "300px"}}></div>
}
