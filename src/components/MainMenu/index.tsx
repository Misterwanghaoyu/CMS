
import { useState } from 'react';
import { ConfigProvider, Menu, theme } from 'antd';
import { useNavigate, useLocation } from "react-router-dom"
import type { MenuProps, MenuTheme } from 'antd';
import { routeData } from '@/router';
import { convertRoutesToMenuItems } from '@/utils/convertFunctions';
// 登录请求到数据之后，就可以跟items这个数组进行匹配


const MainMenu: React.FC = () => {
  const navigateTo = useNavigate()
  const currentRoute = useLocation();
  const navItems = convertRoutesToMenuItems(routeData);
  const menuClick = (e: { key: string }) => {
    // 点击跳转到对应的路由   编程式导航跳转， 利用到一个hook
    navigateTo(e.key);
  }

  // 拿着currentRoute.pathname跟items数组的每一项的children的key值进行对比，如果找到了相等了，就要他上一级的key
  // 这个key给到openKeys数组的元素，作为初始值

  let firstOpenKey: string = "";
  // 在这里进行对比   find
  function findKey(obj: { key: string }) {
    return obj.key === currentRoute.pathname
  }
  // 多对比的是多个children
  for (let i = 0; i < navItems.length; i++) {
    // 判断找到不到
    // @ts-ignore
    if (navItems[i]!['children'] && navItems[i]!['children'].length > 0 && navItems[i]!['children'].find(findKey)) {
      firstOpenKey = navItems[i]!.key as string;
      break;
    }
  }
  //items[???]['children'].find(findKey)   // 这结果如果找到拿到的，就是找到的这个对象，转布尔值就是true。如果找不到转布尔值就是false

  // 设置展开项的初始值
  const [openKeys, setOpenKeys] = useState([firstOpenKey]);
  const handleOpenChange = (keys: string[]) => {
    // 什么时候执行这个函数里面的代码？展开和回收某项菜单的时候执行这里的代码
    // console.log(keys);  // keys是一个数组，记录了当前哪一项是展开的(用key开记录)
    // 把这个数组修改成最后一项，因为只要一项是展开的，就是我刚刚点击的这一项
    setOpenKeys([keys[keys.length - 1]]);
    // console.log(keys); 
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            "colorText":"#fff",
            "itemBg": "rgb(24,144,255)",
            "subMenuItemBg":"rgb(24,144,255)"
          },
        },
      }}
    >
      <Menu
        // defaultSelectedKeys 表示当前样式所在的选中项的key
        // theme='dark'
        defaultSelectedKeys={[currentRoute.pathname]}
        style={{ height: "100%" }}
        mode="inline"
        // 菜单项的数据
        items={navItems}
        onClick={menuClick}
        // 某项菜单展开和回收的事件
        onOpenChange={handleOpenChange}
        // 当前菜单展开项的key数组
        openKeys={openKeys}
      />
    </ConfigProvider>


  )
}
export default MainMenu;