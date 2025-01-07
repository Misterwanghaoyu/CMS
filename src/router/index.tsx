import React, { lazy } from "react"
// Navigate重定向组件
import { Navigate } from "react-router-dom"
import {
  CloudUploadOutlined,
  HomeOutlined,
  LineChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Home from "../views/Home"
// import About from  "../views/About"
// import User from  "../views/User"
import Login from "../views/login"
import { convertRoutesToRouteItems } from "@/utils/convertFunctions";
import { Skeleton } from "antd";
import NotFoundPage from "@/views/404";
import NoPermissionPage from "@/views/403";
const Main = lazy(() => import("../views/main"))
const Data = lazy(() => import("../views/case"))
const User = lazy(() => import("../views/user"))
// const Backup = lazy(() => import("../views/backup"))

const DataAdd = lazy(() => import("../views/case/add"))
const DataSearch = lazy(() => import("../views/case/search"))
const DataUpdate = lazy(() => import("../views/case/update"))

const UserInformation = lazy(() => import("../views/user/information"))
const UserLogs = lazy(() => import("../views/user/logs"))

// 报错A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. 
// 懒加载的模式的组件的写法，外面需要套一层 Loading 的提示加载组件


const withLoadingComponent = (comp: JSX.Element) => (
  <React.Suspense fallback={<Skeleton active />}>
    {comp}
  </React.Suspense>
)
export const routeData: RouteDataItemType[] = [
  {
    label: '首页',
    key: 'main',
    icon: <HomeOutlined />,
    path: 'main',
    component: withLoadingComponent(<Main />),
    meta: {
      title: '首页',
    },
  },
  {
    label: '数据信息',
    icon: <LineChartOutlined />,
    key: 'data',
    path: 'data',
    component: withLoadingComponent(<Data />),
    meta: {
      title: '数据信息',
    },
    children: [
      {
        label: '数据录入',
        key: 'add',
        path: 'add',
        component: withLoadingComponent(<DataAdd />),
        meta: {
          title: '数据录入',
          // icon: <OrderedListOutlined/>
        },
      },
      {
        label: '数据查询',
        key: 'search',
        path: 'search',
        component: withLoadingComponent(<DataSearch />),
        meta: {
          title: '数据查询',
          // icon:  <OrderedListOutlined/>
        },
      },
      {
        label: '数据修改',
        hidden: true,
        key: 'update',
        path: 'update',
        component: withLoadingComponent(<DataUpdate />),
        meta: {
          title: '数据修改',
          // icon: <OrderedListOutlined/>
        },
      },
    ],
  },
  {
    label: '用户管理',
    icon: <UserOutlined />,
    key: 'user',
    path: 'user',
    component: withLoadingComponent(<User />),
    meta: {
      title: '用户管理',
    },
    children: [
      {
        label: '用户信息',
        key: 'information',
        path: 'information',
        component: withLoadingComponent(<UserInformation />),
        meta: {
          title: '用户信息',
          // icon: <OrderedListOutlined/>
        },
      },
      {
        label: '日志详情',
        key: 'logs',
        path: 'logs',
        component: withLoadingComponent(<UserLogs />),
        meta: {
          title: '日志详情',
          // icon:  <OrderedListOutlined/>
        },
      }
    ],
  },
  // {
  //   label: '数据备份与修复',
  //   key: 'backup',
  //   path: 'backup',
  //   component: withLoadingComponent(<Backup />),
  //   meta: {
  //     title: '数据备份与修复',
  //     icon: <CloudUploadOutlined />
  //   },
  // }
]
const routes: RouteItemType[] = [

  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Navigate to="/main" />,
  },
  {
    path: "/403",
    element: <NoPermissionPage />
  },
  {
    path: "/404",
    element: <NotFoundPage />
  },
  {
    path: "/data",
    element: <Navigate to="/data/search" />
  },
  {
    path: "/user",
    element: <Navigate to="/user/information" />
  },
  //  嵌套路由 开始-------------------
  {
    path: "/",
    element: <Home />,
    children: convertRoutesToRouteItems(routeData)
  },
  // 嵌套路由 结束-------------------

  {
    path: "*",
    element: <Navigate to="/404" />
  }

  // {
  //   path:"/home",
  //   element: <Home />
  // },
  // {
  //   path:"/about",
  //   element: withLoadingComponent(<About />)

  // },
  // {
  //   path:"/user",
  //   element: withLoadingComponent(<User />)
  // }
]

export default routes