import { Select } from 'antd'
import React, { ChangeEvent, useMemo, useRef, useState } from 'react'
import BarChart from '@/components/BarChart';
import PieChart from '@/components/PieChart';
import LineChart from '@/components/LineChart';

import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'


export default function Charts() {
  const [chartsType, setChartsType] = useState("bar")
  

  const whichChart = useMemo(() => {
    let returnChart;
    switch (chartsType) {
      case "bar":
        returnChart = <BarChart />
        break;
      case "pie":
        returnChart = <PieChart />
        break;
      default:
        returnChart = <LineChart />
        break;
    }
    return returnChart
  }, [chartsType])


  const exportExcel = () => {
    const workbook = new ExcelJS.Workbook()
    const sheet1 = workbook.addWorksheet("sheet1")
    const data = [
      {

        name: "总量",

        data: [2200, 230, 224, 218, 135, 147, 260],

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
    ]
    const headers = Object.keys(data[0])
    sheet1.addRow(headers)
    data.forEach((row) => {
      const values = Object.values(row)
      sheet1.addRow(values)
    })
    workbook.xlsx.writeBuffer().then((buffer) => {
      let file = new Blob([buffer], { type: "application/octet-stream" })
      FileSaver.saveAs(file, "ExcelJS.xlsx")
    }).catch(err => console.log(err))
  }
  const importExcel = (e:ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const workbook = new ExcelJS.Workbook()
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(files[0])
    fileReader.onload = (ev:ProgressEvent<FileReader>) => {
      // @ts-ignore
      workbook.xlsx.load(ev.target!.result).then(workbook => {
        const worksheet = workbook.getWorksheet(1)
        const headers:ExcelJS.CellValue[] = []
        if (!worksheet) return
        worksheet.getRow(1).eachCell(cell => {
          headers.push(cell.value)
        })
        const data = []

        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {

          const rowData = {}
          const row = worksheet.getRow(rowNumber)

          row.eachCell((cell, colNumber) => {
            //@ts-ignore
            rowData[headers[colNumber - 1]] = cell.value
          })
          data.push(rowData)
        }
        console.log("data", data);

      })

    }
  }
  return (
    <div>
      <Select
        style={{
          width: 120,
        }}
        placeholder={"选择图表类别"}
        allowClear
        onChange={(value) => setChartsType(value)}
        value={chartsType}
        defaultValue={chartsType}
        options={[
          {
            value: "bar",
            label: "柱状图",
          },
          {
            value: "pie",
            label: "饼图",
          },
          {
            value: "line",
            label: "折线图",
          }
        ]}
      />
      <button onClick={exportExcel}>export as Excel</button>
      <input type="file" accept='.xls,.xlsx' onChange={(e) => importExcel(e)}/>
      {whichChart}
    </div>
  )
}
