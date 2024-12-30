
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
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce, throttle } from "lodash"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

export default function Information() {
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    searchValue: "",
  });
  const { message, notification } = App.useApp();

  const [userList, setUserList] = useState<UserDataType[]>([]);
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
  const handleDelete = (userId: number) => {
    userApi.deleteUser([userId]).then(
      res => {
        if (res.code === 0) {
          notification.success({
            message: "成功",
            description: "删除成功"
          })
          reFetch()
        } else {
          notification.error({
            message: "错误",
            description: res.message
          })
        }
      },
      rej => {
        notification.error({
          message: "错误",
          description: "something wrong,request rejcted."
        })
      }
    ).catch(err => {
      notification.error({
        message: "错误",
        description: err.message
      })
    }
    )
  }
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
          <Button type='link' onClick={() => handleEdit(record)}><EditOutlined />编辑</Button>
          <Popconfirm
            title="删除用户"
            description="确认删除此用户?"
            onConfirm={() => handleDelete(record.userId)}
            okText="是"
            cancelText="否"
          >
            <Button type='link' danger><DeleteOutlined />删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleUserSearch = (value:string) => {

    if(value.length===0) return
    userApi.searchUserById(value).then(
      res => {
        if (res.code === 0) {
          notification.success({
            message: "成功",
            description: "查询成功"
          })
          setUserList([res.data])
        }else{
          notification.error({
            message: "错误",
            description: res.message
          })
        }
      },
      rej => {  
        notification.error({
          message: "错误",
          description: "something wrong,request rejcted."
        })
      }
    ).catch(err => {
      notification.error({
        message: "错误",
        description: err.message
      })
    }
    )
  }
  const reFetch = () => {
    userApi.getAllUser().then(res => {
      if (res.code === 0) {
        setUserList(res.data)
      } else {
        notification.error({
          message: "错误",
          description: "something wrong,request rejcted."
        })
      }
    }, rej => {
      notification.error({
        message: "错误",
        description: "something wrong,request rejcted."
      })
    }).catch(err => {
      notification.error(err.message)
    })
  }
  useEffect(() => {
    reFetch()
  }, [])
  // const debounceSearch = useCallback(debounce(handleUserSearch, 1000), [])
  // useEffect(()=>{
  //   debounceSearch(params.searchValue)
  // }, [params]); //监听搜索参数的变化，如果变化了，就重新获取数据

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Button type="primary" onClick={handleAddUserButton}>新增用户</Button>
          <Input.Search
            // value={params.searchValue}
            // onChange={(e) => setParams({ ...params, searchValue: e.target.value })}
            onSearch={(value)=>handleUserSearch(value)}
            style={{ width: "200px" }}
            allowClear
            placeholder="输入用户ID查询"
          />
        </Space>
        {/* <ConfigProvider locale={zhCN}> */}
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
        >
        </Table>
      </Space>
      <AddEditUserModal selectedRowItem={selectedRowItem} isModalOpen={isModalOpen} isUpdate={isUpdate} setIsModalOpen={setIsModalOpen} form={form} reFetch={reFetch} />
      {selectedRowItem && <Card size="default" title={selectedRowItem.realName} style={{ width: "100%" }}
      >
        <p>客户ID：{selectedRowItem.userId}</p>
        <p>联系方式：{selectedRowItem.mobile}</p>
        <p>权限：{selectedRowItem.roleId}</p>
      </Card>}
    </>
  )
}
