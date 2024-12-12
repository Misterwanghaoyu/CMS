import React, { useState } from 'react'
import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { Input } from 'antd';
export default function BarChart() {
  const chartRef = useRef(null);
  const [id, setId] = useState<string>()
  const [total, setTotal] = useState(2200)
  useEffect(() => {
    let chartInstance = echarts.init(chartRef.current);

    const option = {

      legend: {

        data: [
          id ? `检案编号：${id}的总量` : "总量",

          "司法鉴定",

          "破译解密",

          "敌情方向1",

          "敌情方向2",

          "敌情方向3",

          "敌情方向4",

        ],

      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {

        type: "category",

        data: ["2024-12-03", "2024-12-04", "2024-12-05", "2024-12-06", "2024-12-07", "2024-12-08", "2024-12-09"],

      },

      yAxis: [

        {

          type: "value",

          name: "件",

          nameTextStyle: {

            color: "#ccc",

            padding: [0, 0, 10, -30],

          },

          splitNumber: 5,

          splitLine: {

            show: true,

            lineStyle: {

              type: "dashed",

              width: 1,

              color: ["#ccc", "#ccc"],

            },

          },

          axisLabel: {

            show: true,

            textStyle: {

              fontSize: 12,

            },

          },

        },

      ],

      tooltip: {

        trigger: "axis",

        axisPointer: {

          type: "shadow",

        },

        textStyle: {

          color: "#fff",

          align: "left",

          fontSize: 14,

        },

        backgroundColor: "rgba(0,0,0,0.8)",

      },

      series: [
        {

          name: id ? `检案编号：${id}的总量` : "总量",

          data: [total, 230, 224, 218, 135, 147, 260],

          type: "bar",

        },
        {

          name: "司法鉴定",

          data: [150, 230, 224, 218, 135, 147, 260],

          type: "bar",

        },

        {

          name: "破译解密",

          data: [150, 230, 224, 218, 135, 147, 260],

          type: "bar",

        },

        {

          name: "敌情方向1",

          data: [150, 230, 224, 218, 135, 147, 260],

          type: "bar",

        },

        {

          name: "敌情方向2",

          data: [880, 30, 124, 118, 35, 47, 160],

          type: "bar",

        },

        {

          name: "敌情方向3",

          data: [660, 30, 124, 118, 35, 47, 160],

          type: "bar",

        },

        {

          name: "敌情方向4",

          data: [880, 30, 124, 118, 35, 47, 160],

          type: "bar",

        },
      ],

    };

    chartInstance.setOption(option);

  }, [id,total])
  const searchHandler=(value:string)=>{
    
    setId(value)
    const random=Math.random() * (2000 - 1000) + 1000;
    setTotal(Math.floor(random))
  }
  return (
    <div style={{ textAlign: "center"}}>
      <Input.Search
        onSearch={(value) => searchHandler(value)}
        style={{ width: "200px" }}
        allowClear
        placeholder="请输入检案编号"
        enterButton
      />

      <div ref={chartRef} style={{ height: "400px" }}></div>


    </div>
  )
}
