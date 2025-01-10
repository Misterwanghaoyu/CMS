import { useEffect, useRef } from "react";
import * as echarts from "echarts";
export default function BarChart({ data }: { data: { keywords: string[], total: number[] } }) {
  const chartRef = useRef(null);
  if (!data) return <div>暂无数据</div>
  const { keywords, total } = data
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option: echarts.EChartsOption = {
      xAxis: {
        type: 'category',
        data: keywords,
        name: '敌情方向'
      },
      yAxis:{
        type: 'value',
        name: '数量',
        min: 0
      }
      ,
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
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
          data: total,
          type: 'bar',
          animationDelay: function (idx: number) {
            return idx * keywords.length * 5;
          }
        },

      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx: number) {
        return idx * keywords.length * 5;
      }
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
  return <div ref={chartRef} style={{ height: "300px" }}></div>
}
