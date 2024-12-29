import { deleteJudicialCase, deleteDecryptionCase } from '@/request/api';
import { exportAsExcel } from '@/utils/convertFunctions'
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { App, Button, Flex, Form, Popconfirm, Space, Table, TableColumnsType, Tag, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Logs() {
  const [form] = Form.useForm();
  const navigateTo = useNavigate()
  const { message, notification } = App.useApp();

  const [isAllSelected, setIsAllSelected] = useState(false)
  const [dataSource, setDataSource] = useState<CaseDataType[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    name: "",
    code: "",
  });
  const total = useMemo(() => dataSource.length, [dataSource])
  const hasSelected = selectedRowKeys.length > 0;

  // 展示总条数
  const showTotal = (total: number) => {
    return `共 ${total} 条`;
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<CaseDataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleDetail = (item: CaseDataType) => {
    // navigateTo('/data/update', {
    //   state: {
    //     editItem: item
    //   }
    // })
  }
  const handleDelete = (item: CaseDataType) => {
    // deleteJudicialCase([item.judicial_id]).then(
    //   res => {
    //     notification.success({
    //       message: '成功',
    //       description: '数据删除成功'
    //     })
    //     form.resetFields()
    //   },
    //   rej => {
    //     notification.error({
    //       message: '错误',
    //       description: 'something wrong,request rejcted.'
    //     })
    //   }
    // ).catch(err => {
    //   notification.error({
    //     message: '错误',
    //     description: err.message
    //   })
    // }
    // )
  }
  const columns: TableColumnsType<CaseDataType> = [
    { key: "create_date", title: '创建时间', dataIndex: 'create_date' },

    { key: 'user_id', title: '操作用户ID', dataIndex: 'user_id' },
    { key: "operation_title", title: '操作标题', dataIndex: 'operation_title' },
    { key: "operation_type", title: '操作类型', dataIndex: 'operation_type' },
    { key: "execute_time", title: '执行时长', dataIndex: 'execute_time' },
    { key: "ip_address", title: 'IP地址', dataIndex: 'ip_address' },
    { key: "operation_state", title: '操作状态', dataIndex: 'operation_state' },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleDetail(record)}><EditOutlined />详情</Button>
          <Popconfirm
            title="删除案件"
            description="确认删除此案件?"
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

  useEffect(() => {
    const fakeData = Array.from<any>({ length: 46 }).map<any>((_, i) => ({
      key: i,
      create_date: moment(new Date()).format("YYYY-MM-DD"),
      user_id: `${i}`,
      operation_title: i % 2 === 1 ? `司法鉴定` : `破译解密`,
      operation_type: `新增`,
      execute_time: `敌情方向${i}`,
      ip_address: "why",
      operation_state:"success"
    }))
    setDataSource(fakeData)
  }, [])

  const handleSelectAll = () => {
    let allSelectedRowKeys: number[]
    if (isAllSelected) allSelectedRowKeys = []
    else allSelectedRowKeys = dataSource.map((_, dataIndex) => dataIndex)
    setIsAllSelected(!isAllSelected)
    setSelectedRowKeys(allSelectedRowKeys)
  }
  const handlePaginationChange = (newPageNum: number, newPageSize: number) => {
    setParams({
      ...params,
      current: newPageNum,
      size: newPageSize,
      name: "",
      code: "",
    });
  };
 const handleMultipleDelete = () => {
    if (selectedRowKeys.length === 0) return message.error("请至少选择一条数据")
    const items = dataSource.filter((item) => selectedRowKeys.includes(item.key))
    // deleteCaseMultiple(items)
  }
  return (
    <div>
      <Flex gap="middle" vertical>
        <Typography.Title level={5}>日志详情</Typography.Title>
        <Table<CaseDataType>
          // onRow={(record) => ({
          //   onClick: () => setSelectedRowItem(record)
          // })}
          pagination={{
            current: params.current,
            pageSize: params.size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: showTotal,
            onChange: handlePaginationChange,
          }} rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
        <Space>
          <Button type="primary" onClick={handleSelectAll}>
            {isAllSelected ? "取消全选" : "全选"}
          </Button>
          <Button type="primary" onClick={handleMultipleDelete}>
            批量删除
          </Button>
          <Button type="primary" onClick={() => exportAsExcel(dataSource, selectedRowKeys)}>
            批量导出
          </Button>
          {hasSelected && <Tag icon={<CheckCircleOutlined />} color="success" bordered={false}>{`已选中 ${selectedRowKeys.length} 条`}</Tag>}
        </Space>
      </Flex>
    </div>
  )
}
