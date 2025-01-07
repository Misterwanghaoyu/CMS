// 基础菜单项接口
interface BaseMenuItem {
  label?: string
  key: string
  icon?: ReactElement | JSX.Element | null
  children?: any[]
  hidden?: boolean
}

// 导航菜单项继承基础菜单项
interface NavMenuItemType extends BaseMenuItem {
  theme?: string
}

// 菜单项类型继承基础菜单项
interface MenuItemType extends BaseMenuItem {
  hidden?: boolean
}

// 路由数据项继承基础菜单项
interface RouteDataItemType extends BaseMenuItem {
  path: string
  component: JSX.Element
  meta?: {
    title: string
  }
  children?: RouteDataItemType[]
}

// 路由项类型
type RouteItemType = {
  path: string
  element: JSX.Element | null
  children?: RouteItemType[]
}

// 用户数据类型
interface UserDataType {
  userId: number
  username: string
  mobile: string
  realName: string
  deptId: number
  avatar: string
  sex: number
  email: string
  remark: string
  roleId: number
}

// 日志项类型
interface LogDataType {
  logId: number
  username: string
  operation: string
  operType: number
  operFaultMsg: string
  operIp: string
  createDate: string
}


