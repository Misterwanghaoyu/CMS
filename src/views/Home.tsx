
import { Layout, Button, Dropdown, Space, theme, Typography, ConfigProvider, App, Flex, Image } from 'antd';
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import MainMenu from "@/components/MainMenu"
import logo from "@/assets/images/logo.png";
import { ArrowLeftOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { convertRoutesToBreadcrumbItems } from '@/utils/convertFunctions';
import { routeData } from '@/router';
const { Header, Content, Sider } = Layout;
import zhCN from 'antd/locale/zh_CN';
const siderBackgroundColor = "rgb(24,144,255)"
const itemSelectedBg = "rgb(9,109,217)"
const View: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigateTo = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem("userInfo")!)
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
  // 退出
  const onClick = ({ key }: { key: string }) => {
    localStorage.removeItem("userInfo")
    localStorage.removeItem("token")
    navigateTo("/login");
  };
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs: any[] = [];
  convertRoutesToBreadcrumbItems(routeData, pathnames, breadcrumbs)

  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    height: '100%',
    maxHeight: '100%',
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