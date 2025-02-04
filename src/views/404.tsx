import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const NotFoundPage: React.FC = () => {
  const navigateTo = useNavigate()
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => navigateTo("/")}>返回首页</Button>}
    />
  )
}

export default NotFoundPage;