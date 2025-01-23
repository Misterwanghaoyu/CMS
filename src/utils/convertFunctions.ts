// 路由相关转换方法
function convertRoutesToMenuItems(routes: RouteDataItemType[], parentPath = '') {
  const menuItems = routes.map(route => {
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
    if (route.hidden) return
    const menuItem: MenuItemType = {
      label: route.label || '',
      key: fullPath || '',
      icon: route.icon || null,
    };
    if (route.children && route.children.length > 0) {
      menuItem.children = convertRoutesToMenuItems(route.children, fullPath);
    }
    return menuItem;
  });
  // 过滤掉undefined
  return menuItems.filter(item => item !== undefined) as MenuItemType[];
}

function convertRoutesToRouteItems(routes: RouteDataItemType[], parentPath = '') {
  return routes.map(route => {
    const newRoute: RouteItemType = {
      path: route.path,
      element: route.component,
    };

    if (route.children && route.children.length > 0) {
      newRoute.children = convertRoutesToRouteItems(route.children);
    }

    return newRoute;
  });
}

const convertRoutesToBreadcrumbItems = (routes: RouteDataItemType[], pathnames: string[], breadcrumbs: any[]) => {
  for (let i = 0; i < routes.length; i++) {
    const item = routes[i];
    if (item.path === pathnames[0]) {
      pathnames.shift();
      breadcrumbs.push(item);
      if (item.children) {
        convertRoutesToBreadcrumbItems(item.children, pathnames, breadcrumbs);
      }
      break;
    }
  }
};
export {
  convertRoutesToMenuItems,
  convertRoutesToBreadcrumbItems,
  convertRoutesToRouteItems,
}

// // Excel相关方法
// const exportAsExcel = (exportData1: any[], exportData2: any[], matterIds: number[]) => {
//   const workbook = new ExcelJS.Workbook()
//   const sheet1 = workbook.addWorksheet("sheet1")
//   const sheet2 = workbook.addWorksheet("sheet2")

//   // 处理第一个sheet
//   const headers = Object.keys(exportData1[0])
//   sheet1.addRow(headers)
//   exportData1.forEach((row) => {
//     const values = Object.values(row)
//     sheet1.addRow(values)
//   })

//   // 处理第二个sheet
//   const headers2 = Object.keys(exportData2[0])
//   sheet2.addRow(headers2)
//   exportData2.forEach((row) => {
//     const values = Object.values(row)
//     sheet2.addRow(values)
//   })

//   workbook.xlsx.writeBuffer()
//     .then((buffer) => {
//       let file = new Blob([buffer], { type: "application/octet-stream" })
//       FileSaver.saveAs(file, "ExcelJS.xlsx")
//       logsApi.insertExportMatterLog(matterIds)
//     })
//     .catch(err => console.log(err))
// }

// const parseExcel = async (e: ChangeEvent<HTMLInputElement>) => {
//   const files = e.target.files
//   if (!files) return

//   return new Promise((resolve, reject) => {
//     const workbook = new ExcelJS.Workbook()
//     const fileReader = new FileReader()

//     fileReader.onload = async (ev: ProgressEvent<FileReader>) => {
//       try {
//         // @ts-ignore
//         await workbook.xlsx.load(ev.target!.result)
//         const worksheet1 = workbook.getWorksheet(1)
//         const worksheet2 = workbook.getWorksheet(2)

//         if (!worksheet1) {
//           reject(new Error('工作表1不存在'))
//           return
//         }
//         if (!worksheet2) {
//           reject(new Error('工作表2不存在'))
//           return
//         }

//         const headers1: ExcelJS.CellValue[] = []
//         const headers2: ExcelJS.CellValue[] = []
//         const data1 = []
//         const data2 = []

//         // 获取表头
//         worksheet1.getRow(1).eachCell(cell => headers1.push(cell.value))
//         worksheet2.getRow(1).eachCell(cell => headers2.push(cell.value))

//         // 获取数据
//         for (let rowNumber = 2; rowNumber <= worksheet1.rowCount; rowNumber++) {
//           const rowData = {}
//           worksheet1.getRow(rowNumber).eachCell((cell, colNumber) => {
//             //@ts-ignore
//             rowData[headers1[colNumber - 1]] = cell.value
//           })
//           data1.push(rowData)
//         }

//         for (let rowNumber = 2; rowNumber <= worksheet2.rowCount; rowNumber++) {
//           const rowData = {}
//           worksheet2.getRow(rowNumber).eachCell((cell, colNumber) => {
//             //@ts-ignore
//             rowData[headers2[colNumber - 1]] = cell.value
//           })
//           data2.push(rowData)
//         }

//         resolve([data1, data2])
//       } catch (error) {
//         reject(error)
//       }
//     }

//     fileReader.onerror = () => reject(new Error('文件读取失败'))
//     fileReader.readAsArrayBuffer(files[0])
//   })
// }