import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import ExcelJS from 'exceljs'
import FileSaver from "file-saver";
import { message } from "antd";

function convertRoutesToMenuItems(routes: RouteDataItemType[], parentPath = '') {
  const navigateTo = useNavigate()

  return routes.map(route => {
    type menuItemType = {
      label: string
      key: string
      icon: JSX.Element | null
      disabled?:boolean
      // onTitleClick: () => void
      children?: menuItemType[]
    }
    const fullPath = parentPath ? `${parentPath}/${route.path}` : route.path;
    const menuItem: menuItemType = {
      label: route.meta?.title || '',
      key: fullPath || '',
      icon: route.meta.icon || null,
      disabled:route.meta.disabled
      // onTitleClick: () => navigateTo(route.path)
    };

    if (route.children && route.children.length > 0) {
      menuItem.children = convertRoutesToMenuItems(route.children, fullPath);
    }

    return menuItem;
  });
}
const exportAsExcel = (dataSource:CaseDataType[],selectedRowKeys:React.Key[]) => {
  if (selectedRowKeys.length === 0) return message.error("请至少选择一条数据")
  const data = dataSource.filter((item) => selectedRowKeys.includes(item.key))
  const workbook = new ExcelJS.Workbook()
  const sheet1 = workbook.addWorksheet("sheet1")
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
const importExcel = (e: ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files) return
  const workbook = new ExcelJS.Workbook()
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(files[0])
  fileReader.onload = (ev: ProgressEvent<FileReader>) => {
    // @ts-ignore
    workbook.xlsx.load(ev.target!.result).then(workbook => {
      const worksheet = workbook.getWorksheet(1)
      const headers: ExcelJS.CellValue[] = []
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
function convertRoutesToRouteItems(routes: RouteDataItemType[], parentPath = '') {
  type routeItemType = {
    path: string
    element: JSX.Element | null
    children?: routeItemType[]
  }
  return routes.map(route => {
    const newRoute: routeItemType = {
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
export { convertRoutesToMenuItems, convertRoutesToBreadcrumbItems, convertRoutesToRouteItems,exportAsExcel,importExcel }