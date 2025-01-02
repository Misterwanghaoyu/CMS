import { useEffect, useRef } from "react";
import * as echarts from "echarts";
export default function BarChart({data}:{data:{keywords:string[],total:number[]}}) {
  const chartRef = useRef(null);

  const {keywords,total} = data
  
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option = {
      xAxis: {
        type: 'category',
        data: keywords
      },
      yAxis: {
        type: 'value'
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
      series: [
        {
          data:total,
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

  }, [data])
  return  <div ref={chartRef} style={{ height: "300px"}}></div>
}
