import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  style?: React.CSSProperties;
  data: {value:number,name:string}[]
  name:string
}

const PieChart: React.FC<PieChartProps> = ({ style,name,data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom'
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: [
        {
          name,
          type: 'pie',
          // radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          // itemStyle: {
          //   borderRadius: 10,
          //   borderColor: '#fff',
          //   borderWidth: 2
          // },
          // label: {
          //   show: false,
          //   position: 'center'
          // },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{name|{b}}：{time|{c}}',
            fontSize: 16,
            rich: {
              time: {
                fontSize: 16,
                color: '#000'
              }
            }
          },
          labelLine: {
            // length: 15,
            // length2: 0,
            // maxSurfaceAngle: 80
          },
          // labelLayout: function (params) {
          //   const isLeft = params.labelRect.x < myChart.getWidth() / 2;
          //   const points = params.labelLinePoints;
          //   // Update the end point.
          //   points[2][0] = isLeft
          //     ? params.labelRect.x
          //     : params.labelRect.x + params.labelRect.width;
          //   return {
          //     labelLinePoints: points
          //   };
          // },
          // labelLine: {
          //   show: false
          // },
          data
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
  }, [data]);

  return <div ref={chartRef} style={{ height: '300px', ...style }} />;
};

export default PieChart;