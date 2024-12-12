import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Radio,
  Table,
  Select,
  Space,
  ConfigProvider,
  // Watermark,
} from "antd";
// import zhCN from "antd/locale/zh_CN";
import { useEffect, useState } from "react";

// 导入APi
// import userApi from "../../api/UserApi";
const User = () => {
  const { Column } = Table;
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    name: "",
    code: "",
  });
  const [blogList, setBlogList] = useState([]);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    getBlogList();
  }, [params]); //监听搜索参数的变化，如果变化了，就重新获取数据
  const getBlogList = async () => {
    // const { data } = await userApi.getUserList(params);
    // setTotal(data.data.total);
    // setBlogList(data.data.records);
  };
  const handlePaginationChange = (newPageNum, newPageSize) => {
    setParams({
      ...params,
      current: newPageNum,
      size: newPageSize,
      name: "",
      code: "",
    });
  };

  // 展示总条数
  const showTotal = (total) => {
    return `共 ${total} 条`;
  };

  return (
    <div>
      {/* 操作栏 */}
      <Space style={{ marginBottom: "10px" }}>
        <Input.Search
          value={params.name}
          onChange={(e) => setParams({ ...params, name: e.target.value })}
          style={{ width: "200px" }}
          allowClear
          placeholder="请输入名称"
          enterButton
        />
      </Space>
      {/* <ConfigProvider locale={zhCN}> */}
        <Table
          rowKey={(record) => record.id}
          bordered={true}
          pagination={{
            current: params.current,
            pageSize: params.size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: showTotal,
            onChange: handlePaginationChange,
          }}
          dataSource={blogList}
          scroll={{ y: 540 }}
        >
          <Column title="编号" dataIndex="code" key="code" />
          <Column title="账号" dataIndex="username" key="username" />
          <Column title="姓名" dataIndex="name" key="name" />
        </Table>
      {/* </ConfigProvider> */}
    </div>
  );
};

export default User;
