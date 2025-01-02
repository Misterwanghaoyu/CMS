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
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce, throttle } from "lodash"
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

  // 计算属性
  const total = useMemo(() => userList.length, [userList]);

  // 表格列配置
  const columns: TableColumnsType<UserDataType> = [
    {
      title: "编号",
      dataIndex: "userId",
      width: 100,
    },
    {
      title: "账号",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "联系方式", 
      dataIndex: "mobile",
      key: "mobile",
    },
    {
      title: "姓名",
      dataIndex: "realName",
      key: "realName",
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "权限",
      dataIndex: "roleId",
      key: "roleId",
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
  const reFetch = () => {
    userApi.getAll()
      .then(res => {
        if (res.code === 0) {
          setUserList(res.data)
        } else {
          notification.error({
            message: "错误",
            description: "something wrong,request rejcted."
          })
        }
      })
      .catch(err => {
        notification.error({
          message: "错误",
          description: err.message
        })
      });
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
    form.setFieldsValue(item);
    setIsUpdate(true);
    setIsModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    userApi.delete([userId])
      .then(res => {
        if (res.code === 0) {
          notification.success({
            message: "成功",
            description: "删除成功"
          });
          reFetch();
        } else {
          notification.error({
            message: "错误",
            description: res.message
          });
        }
      })
      .catch(err => {
        notification.error({
          message: "错误",
          description: err.message
        });
      });
  };

  const handleUserSearch = (value: string) => {
    if (value.length === 0) return;
    
    userApi.searchById(value)
      .then(res => {
        if (res.code === 0) {
          notification.success({
            message: "成功",
            description: "查询成功"
          });
          setUserList([res.data]);
        } else {
          notification.error({
            message: "错误",
            description: res.message
          });
        }
      })
      .catch(err => {
        notification.error({
          message: "错误",
          description: err.message
        });
      });
  };

  // 副作用
  useEffect(() => {
    reFetch();
  }, []);

  return (
    <Flex gap="middle" vertical>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Button type="primary" onClick={handleAddUserButton}>新增用户</Button>
          <Input.Search
            onSearch={handleUserSearch}
            onClear={reFetch}
            style={{ width: "200px" }}
            allowClear
            placeholder="输入用户ID查询"
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
        <Card 
          size="default" 
          title={selectedRowItem.realName} 
          style={{ width: "100%" }}
        >
          <p>客户ID：{selectedRowItem.userId}</p>
          <p>联系方式：{selectedRowItem.mobile}</p>
          <p>权限：{selectedRowItem.roleId}</p>
        </Card>
      )}
    </Flex>
  );
}
