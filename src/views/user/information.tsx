import AddEditUserModal from "@/components/AddEditUserModal";
import { userApi } from "@/request/api";
import {
  Button,
  Form,
  Input,
  Table,
  Space,
  Card,
  TableColumnsType,
  Popconfirm,
  App,
  Flex,
  Typography,
  Descriptions,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function Information() {
  // 状态管理
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    searchValue: "",
  });
  const [userList, setUserList] = useState<UserDataType[]>([]);
  const [selectedRowItem, setSelectedRowItem] = useState<UserDataType | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();

  // const detailInformationItem = useMemo(() => {
  //   if (!selectedRowItem) return []
  //   return Object.keys(selectedRowItem).map((key) => ({
  //     key,
  //     label: key,
  //     children: selectedRowItem[key as keyof UserDataType]
  //   }))
  // }, [selectedRowItem])
  // 计算属性
  const total = useMemo(() => userList.length, [userList]);

  // 表格列配置
  const columns: TableColumnsType<UserDataType> = [
    {
      title: "编号",
      dataIndex: "userId",
    },
    {
      title: "账号",
      dataIndex: "username",
      key: "username",
    },
    // {
    //   title: "联系方式",
    //   dataIndex: "mobile",
    //   key: "mobile",
    // },
    // {
    //   title: "姓名",
    //   dataIndex: "realName",
    //   key: "realName",
    // },
    // {
    //   title: "性别",
    //   dataIndex: "sex",
    //   key: "sex",
    // },
    // {
    //   title: "邮箱",
    //   dataIndex: "email",
    //   key: "email",
    // },
    {
      title: "权限",
      dataIndex: "roleName",
      key: "roleName",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            <EditOutlined />编辑
          </Button>
          <Popconfirm
            title="删除用户"
            description="确认删除此用户?"
            onConfirm={() => handleDelete(record.userId)}
            okText="是"
            cancelText="否"
          >
            <Button type='link' danger>
              <DeleteOutlined />删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 数据获取方法
  const reFetch = async () => {
    const res = await userApi.getAll()
    setUserList(res)
  };

  // 事件处理方法
  const handlePaginationChange = (newPageNum: number, newPageSize: number) => {
    setParams({
      ...params,
      current: newPageNum,
      size: newPageSize,
      searchValue: "",
    });
  };

  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };

  const handleAddUserButton = () => {
    setIsUpdate(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: UserDataType) => {
    console.log(item);

    form.setFieldsValue(item);
    setIsUpdate(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: number) => {
    await userApi.delete([userId])
    notification.success({
      message: "成功",
      description: "删除成功"
    });
    reFetch();
  };

  const handleUserSearch = async (value: string, type: string) => {
    if (value.length === 0) return;
    let res: any
    if (type === "userId") {
      res = await userApi.searchByUserId(`userId=${value}`)
    } else {
      res = await userApi.searchByUsername(`username=${value}`)
    }
    notification.success({
      message: "成功",
      description: "查询成功"
    });
    if (res instanceof Array) {
      setUserList(res);
    } else {
      setUserList([res]);
    }
  };

  // 副作用
  useEffect(() => {
    reFetch();
  }, []);

  return (
    <Flex gap="middle" vertical justify="space-between" style={{ height: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Button type="primary" onClick={handleAddUserButton}>新增用户</Button>
          <Input.Search
            onSearch={(value) => handleUserSearch(value, "userId")}
            onClear={reFetch}
            style={{ width: "200px" }}
            allowClear
            placeholder="输入用户ID查询"
          />
          <Input.Search
            onSearch={(value) => handleUserSearch(value, "username")}
            onClear={reFetch}
            style={{ width: "200px" }}
            allowClear
            placeholder="输入账号查询"
          />
        </Space>
        <Table
          rowKey={(record) => record.userId}
          onRow={(record) => ({
            onClick: () => setSelectedRowItem(record)
          })}
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
          columns={columns}
          dataSource={userList}
        />
      </Space>

      <AddEditUserModal
        selectedRowItem={selectedRowItem}
        isModalOpen={isModalOpen}
        isUpdate={isUpdate}
        setIsModalOpen={setIsModalOpen}
        form={form}
        reFetch={reFetch}
      />

      {selectedRowItem && (
        <Card>
          <Descriptions title={selectedRowItem.username} extra={<Button type="primary" onClick={() => handleEdit(selectedRowItem)}>编辑</Button>}>
            <Descriptions.Item label="用户ID">{selectedRowItem.userId}</Descriptions.Item>
            <Descriptions.Item label="账号">{selectedRowItem.username}</Descriptions.Item>
            <Descriptions.Item label="姓名">{selectedRowItem.realName}</Descriptions.Item>
            <Descriptions.Item label="性别">{selectedRowItem.sex}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{selectedRowItem.mobile}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{selectedRowItem.email}</Descriptions.Item>
            <Descriptions.Item label="权限">{selectedRowItem.roleName}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Flex>
  );
}
