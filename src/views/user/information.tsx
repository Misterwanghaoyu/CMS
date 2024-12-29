
import AddEditUserModal from "@/components/AddEditUserModal";
import { addUser, deleteUser, searchUserById } from "@/request/api";
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
  Breadcrumb,
  BreadcrumbProps,
  Card,
  TableProps,
  TableColumnsType,
  Popconfirm,
  // Watermark,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce, throttle } from "lodash"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const fakeData = [
  {
    id: "001",
    username: "Admin",
    contact_way: "114514@163.com",
    name: "Li",
    permission: "管理员",
  },
  {
    id: "002",
    username: "User",
    contact_way: "1145141919810",
    name: "Wang",
    permission: "普通用户",
  },
]
export default function Information() {
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    searchValue: "",
  });

  const [userList, setUserList] = useState<any[]>([]);
  const total = useMemo(() => userList.length, [userList])


  const handlePaginationChange = (newPageNum: number, newPageSize: number) => {
    setParams({
      ...params,
      current: newPageNum,
      size: newPageSize,
      searchValue: "",
    });
  };


  // 展示总条数
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const handleAddUserButton = () => {
    setIsUpdate(false)
    setIsModalOpen(true)
  }
  const [selectedRowItem, setSelectedRowItem] = useState<UserDataType | null>(null);
  const [isUpdate, setIsUpdate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm();
  const handleEdit = (item: UserDataType) => {
    //将当前行的数据赋值给表单
    form.setFieldsValue(item);
    setIsUpdate(true);
    setIsModalOpen(true);
  };
  const handleDelete = (item: UserDataType) => {
    deleteUser([item.userId]).then(
      res => {
        notification.success("删除成功")
        form.resetFields()
        setIsModalOpen(false)
      },
      rej => {
        notification.error("something wrong,request rejcted.")
      }
    ).catch(err => {
      notification.error(err.message)
    }
    )
  }
  const columns: TableColumnsType<UserDataType> = [
    {
      title: "编号",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "账号",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "联系方式",
      dataIndex: "contact_way",
      key: "contact_way",
    },
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "权限",
      dataIndex: "permission",
      key: "permission",
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}><EditOutlined />编辑</Button>
          <Popconfirm
            title="删除用户"
            description="确认删除此用户?"
            onConfirm={() => handleDelete(record)}
            okText="是"
            cancelText="否"
          >
            <Button type='link' danger><DeleteOutlined />删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUserSearch = () => {
    const userId = params.searchValue
    searchUserById({
      userId
    }).then(
      res => {
        notification.success("数据已更新")
        form.resetFields()
        setIsModalOpen(false)
      },
      rej => {
        notification.error("something wrong,request rejcted.")
      }
    ).catch(err => {
      notification.error(err.message)
    }
    )
    // setUserList(fakeData);
  }
  useEffect(useCallback(debounce(handleUserSearch, 1000), []), [params]); //监听搜索参数的变化，如果变化了，就重新获取数据

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Button type="primary" onClick={handleAddUserButton}>新增用户</Button>
          <Input
            value={params.searchValue}
            onChange={(e) => setParams({ ...params, searchValue: e.target.value })}
            style={{ width: "200px" }}
            allowClear
            placeholder="输入用户ID查询"
          />
        </Space>
        {/* <ConfigProvider locale={zhCN}> */}
        <Table
          rowKey={(record) => record.id}
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
        >
        </Table>
      </Space>
      <AddEditUserModal isModalOpen={isModalOpen} isUpdate={isUpdate} setIsModalOpen={setIsModalOpen} form={form} />
      {selectedRowItem && <Card size="default" title={selectedRowItem.name} style={{ width: "100%" }}
      >
        <p>客户ID：{selectedRowItem.userId}</p>
        <p>联系方式：{selectedRowItem.contact_way}</p>
        <p>权限：{selectedRowItem.permission}</p>
      </Card>}
    </>
  )
}
