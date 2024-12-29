import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
  style?: React.CSSProperties;
}

const PieChart: React.FC<PieChartProps> = ({ style }) => {
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
      series: [
        {
          name: '破解情况',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 81, name: '破解为"是"', itemStyle: { color: '#1890ff' } },
            { value: 19, name: '破解为"否"', itemStyle: { color: '#ff4d4f' } }
          ]
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
  }, []);

  return <div ref={chartRef} style={{ height: '300px', ...style }} />;
};

export default PieChart;