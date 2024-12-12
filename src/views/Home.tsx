
import { Breadcrumb, Layout, Image, Button, Dropdown, Space } from 'antd';
import React, { useState } from 'react';
import { Outlet, useNavigate } from "react-router-dom"
import MainMenu from "@/components/MainMenu"
import favicon from "@/assets/images/logo.png";
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const View: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigateTo = useNavigate()
  const userInfo=JSON.parse(localStorage.getItem("user")!)
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
  return (
    <Layout style={{ height:"100vh" }}>
      {/* 左边侧边栏 */}
      <Sider trigger={null}  collapsible collapsed={collapsed} >
        <div style={{ textAlign: "center", height:"40px",lineHeight:"40px" }}>
          {collapsed ? (
            <Image width={40} src={favicon} />
          ) : (
            <h3 style={{ color: "white", textAlign: "center" }}>
              案件管理系统
            </h3>
          )}
        </div>
        <hr />
        <MainMenu></MainMenu>
      </Sider>
      {/* 右边内容 */}
      <Layout className="site-layout">
        {/* 右边头部 */}
        <Header className="site-layout-background" style={{
              padding: 0,
              background: "#fff",
              display: "flex",
              justifyContent: "space-between",
            }} >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div className="user-info" style={{paddingRight:"20px"}}>
            <Dropdown menu={{ items, onClick }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  {userInfo.name}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
          {/* <Breadcrumb style={{ lineHeight:'64px' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
        </Header>
        {/* 右边内容部分-白色底盒子 */}
        <Content style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          background: "#fff",
              borderRadius: "10px",
        }} className="site-layout-background">
          {/* 窗口部分 */}
          <Outlet />
        </Content>
        {/* 右边底部 */}
        <Footer style={{ textAlign: 'center', padding: 0, lineHeight: "48px" }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default View;