
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'moment/locale/zh-cn'
import moment from 'moment';
import { routeData } from '@/router';
import zhCN from 'antd/es/locale/zh_CN';
import React, { useState } from 'react';
import logo from "@/assets/images/logo.png";
import MainMenu from "@/components/MainMenu"
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { convertRoutesToBreadcrumbItems } from '@/utils/convertFunctions';
import { ArrowLeftOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Button, Dropdown, Space, theme, Typography, ConfigProvider, App, Flex, Image, ConfigProviderProps } from 'antd';

const { Header, Content, Sider } = Layout;
const siderBackgroundColor = "rgb(24,144,255)"
const itemSelectedBg = "rgb(9,109,217)"
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  height: '100%',
  maxHeight: '100%',
};

moment.locale('zh-cn')
dayjs.locale('zh-cn');

const View: React.FC = () => {
  const navigateTo = useNavigate()
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const items = [
    {
      label: "退出",
      key: "1",
      icon: <LogoutOutlined />,
    },
  ];
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs: any[] = [];
  convertRoutesToBreadcrumbItems(routeData, pathnames, breadcrumbs)
  // 退出
  const onClick = () => {
    localStorage.removeItem("userInfo")
    localStorage.removeItem("token")
    navigateTo("/login");
  };
  return (
    <ConfigProvider locale={zhCN}
      theme={{
        components: {
          Layout: {
            triggerColor: "#fff",
            siderBg: siderBackgroundColor,
            triggerBg: siderBackgroundColor,
          },
          Menu: {
            colorText: "#fff",
            // groupTitleColor: "#000",
            itemSelectedColor: "#fff",
            horizontalItemHoverBg: "#000",
            itemBg: siderBackgroundColor,
            itemSelectedBg: itemSelectedBg,
            itemHoverBg: itemSelectedBg,
            popupBg: siderBackgroundColor,
          },
        },
      }}>
      <App message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft', maxCount: 3 }} style={{ height: "100%" }}>
        <Layout style={layoutStyle}>
          {/* 左边侧边栏 */}
          <Header style={{ background: "#fff" }} >
            <Flex justify="space-between" align="center">
              <Space>
                <Image src={logo} alt="logo" width={32} height={32} />
                <Typography.Title level={4} style={{ margin: 0 }}>
                  案件管理系统
                </Typography.Title>
              </Space>
              <Dropdown menu={{ items, onClick }}>
                <Button type='link'>
                  {userInfo.username}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </Flex>
          </Header>
          <Layout >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
              <MainMenu />
            </Sider>
            <Layout style={{ padding: 20 }}>
              <CustomBreadcrumb />
              <Typography.Title level={5} style={{ padding: "20px 0", margin: 0 }}>
                {/* {breadcrumbs.length > 1 && <ArrowLeftOutlined style={{ paddingRight: 20 }} onClick={() => { navigateTo(breadcrumbs[breadcrumbs.length - 2].path) }} />} */}
                {breadcrumbs.length > 1 && <Space size="large">
                  <ArrowLeftOutlined onClick={() => { navigateTo(-1) }} />
                  <Typography.Title style={{ margin: 0 }} level={5}>{breadcrumbs[breadcrumbs.length - 1].meta.title}</Typography.Title>
                </Space>}
              </Typography.Title>
              <Content style={{
                overflow: 'auto',
                height: "100%",
                padding: 20,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }} className="site-layout-background">
                {/* 窗口部分 */}

                <Outlet />
              </Content>
            </Layout>
            {/* 右边内容部分-白色底盒子 */}

            {/* 右边底部 */}
            {/* <Footer style={{ textAlign: 'center', padding: 0, lineHeight: "48px" }}>Ant Design ©2018 Created by Ant UED</Footer> */}
          </Layout>
        </Layout >
      </App>
    </ConfigProvider>
  );
};

export default View;