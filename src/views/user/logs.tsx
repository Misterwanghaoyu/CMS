import { logsApi } from '@/request/api';
import { OperType } from '@/utils/enum';
import { App, Flex, Form, Table, TableColumnsType, Tag } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface';
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Logs() {
  // 初始化 hooks
  const [form] = Form.useForm();
  const navigateTo = useNavigate();
  const { message, notification } = App.useApp();

  // 状态管理
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    name: "",
    code: "",
  });

  // 计算属性
  const total = useMemo(() => dataSource.length, [dataSource]);
  const hasSelected = selectedRowKeys.length > 0;

  // 事件处理方法
  const handleSelectAll = () => {
    const allSelectedRowKeys = isAllSelected ? [] : dataSource.map((_, index) => index);
    setIsAllSelected(!isAllSelected);
    setSelectedRowKeys(allSelectedRowKeys);
  };

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
    if (selectedRowKeys.length === 0) {
      return message.error("请至少选择一条数据");
    }
    const items = dataSource.filter((item) => selectedRowKeys.includes(item.key));
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const showTotal = (total: number) => `共 ${total} 条`;

  // 表格配置
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableColumnsType<LogDataType> = [
    { key: "logId", title: '日志ID', dataIndex: 'logId' },
    { key: "username", title: '用户名', dataIndex: 'username' },
    { key: "operation", title: '操作内容', dataIndex: 'operation' },
    {
      key: "operType",
      title: '操作类型',
      dataIndex: 'operType',
      render: (_, record) => {
        switch (record.operType) {
          case OperType.add: return <Tag color="blue">新增</Tag>;
          case OperType.update: return <Tag color="green">修改</Tag>;
          case OperType.delete: return <Tag color="red">删除</Tag>;
          case OperType.query: return <Tag color="orange">查询</Tag>;
          default: return <Tag color="purple">其他</Tag>;
        }
      },
    },
    { key: "operFaultMsg", title: '错误信息', dataIndex: 'operFaultMsg' },
    { key: "operIp", title: 'IP地址', dataIndex: 'operIp' },
    { key: "createDate", title: '创建时间', dataIndex: 'createDate' },
  ];

  const fetchData = async () => {
    const res = await logsApi.getLogs();
    const withKeyData = res.map((item: any, index: number) => ({
      ...item,
      key: index
    }));
    setDataSource(withKeyData);
  }
  // 副作用
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Flex gap="middle" vertical justify="space-between" style={{ height: "100%" }}>
      <Table<LogDataType>
        pagination={{
          current: params.current,
          pageSize: params.size,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: showTotal,
          onChange: handlePaginationChange,
        }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      />
      {/* <Space>
        <Button type="primary" onClick={handleSelectAll}>
          {isAllSelected ? "取消全选" : "全选"}
        </Button>
        <Button type="primary" onClick={()=>{}}>
          批量导出
        </Button>
        {hasSelected && (
          <Tag icon={<CheckCircleOutlined />} color="success" bordered={false}>
            {`已选中 ${selectedRowKeys.length} 条`}
          </Tag>
        )}
      </Space> */}
    </Flex>
  );
}
