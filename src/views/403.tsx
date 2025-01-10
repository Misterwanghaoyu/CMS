import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NoPermissionPage: React.FC = () => {
  const navigateTo = useNavigate()

  return (

    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={()=>navigateTo("/")}>返回首页</Button>}
    />
  )
};

export default NoPermissionPage;