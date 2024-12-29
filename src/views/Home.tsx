
import { Breadcrumb, Layout, Image, Button, Dropdown, Space, theme, Typography, ConfigProvider, App } from 'antd';
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
import MainMenu from "@/components/MainMenu"
import favicon from "@/assets/images/logo.png";
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import CustomBreadcrumb from '@/components/CustomBreadcrumb';
import { convertRoutesToBreadcrumbItems } from '@/utils/convertFunctions';
import { routeData } from '@/router';
const { Header, Content, Footer, Sider } = Layout;
import zhCN from 'antd/locale/zh_CN';

const View: React.FC = () => {


  const [collapsed, setCollapsed] = useState(false);
  const navigateTo = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem("user")!)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const items = [
    {
      label: "退出",
      key: "1",
    },
  ];
  // 退出
  const onClick = ({ key }: { key: string }) => {
    localStorage.removeItem("user")
    localStorage.removeItem("lege-react-management-token")
    navigateTo("/login");
  };
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbs: any[] = [];
  convertRoutesToBreadcrumbItems(routeData, pathnames, breadcrumbs)


  return (
    <App message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft' }}>
      <Layout style={{ height: "100vh" }}>
        {/* 左边侧边栏 */}
        <Header style={{
          // padding: 0,
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }} >
          {/* <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          /> */}
          <h3>
            案件管理系统
          </h3>
          <div className="user-info" style={{ paddingRight: "20px" }}>
            <Dropdown menu={{ items, onClick }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {userInfo.username}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>

        </Header>

        {/* 右边内容 */}
        <Layout className="site-layout">
          {/* 右边头部 */}
          <Sider trigger={null} theme='light'>
            {/* <div style={{ textAlign: "center" }}>
          {collapsed ? (
            <Image width={40} src={favicon} />
          ) : (
            <h3 style={{ color: "white", textAlign: "center" }}>
              案件管理系统
            </h3>
          )}
        </div>
        <hr /> */}
            <MainMenu></MainMenu>
          </Sider>
          <Layout style={{ padding: 20 }}>
            <CustomBreadcrumb />

            <Typography.Title level={5} style={{ padding: "20px 0", margin: 0 }}>
              {/* {breadcrumbs.length > 1 && <ArrowLeftOutlined style={{ paddingRight: 20 }} onClick={() => { navigateTo(breadcrumbs[breadcrumbs.length - 2].path) }} />} */}
              {breadcrumbs.length > 1 && breadcrumbs[breadcrumbs.length - 1].meta.title}
            </Typography.Title>


            <ConfigProvider locale={zhCN}>
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
            </ConfigProvider>
          </Layout>
          {/* 右边内容部分-白色底盒子 */}

          {/* 右边底部 */}
          {/* <Footer style={{ textAlign: 'center', padding: 0, lineHeight: "48px" }}>Ant Design ©2018 Created by Ant UED</Footer> */}
        </Layout>
      </Layout >
    </App>
  );
};

export default View;