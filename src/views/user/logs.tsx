import { logsApi } from '@/request/api';
import { exportAsExcel } from '@/utils/convertFunctions'
import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { App, Button, Flex, Form, Popconfirm, Space, Table, TableColumnsType, Tag, Typography } from 'antd'
import { TableRowSelection } from 'antd/es/table/interface';
import moment from 'moment';
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

  const columns: TableColumnsType<LogItemType> = [
    { key: "logId", title: '日志ID', dataIndex: 'logId' },
    { key: "username", title: '用户名', dataIndex: 'username' },
    { key: "operation", title: '操作内容', dataIndex: 'operation' },
    {
      key: "operType",
      title: '操作类型',
      dataIndex: 'operType',
      render: (_, record) => {
        const typeMap = {
          1: { color: 'blue', text: '新增' },
          2: { color: 'green', text: '修改' },
          3: { color: 'red', text: '删除' },
          4: { color: 'orange', text: '查询' }
        };
        // @ts-ignore
        const { color, text } = typeMap[record.operType] || { color: 'purple', text: '其他' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    { key: "operFaultMsg", title: '错误信息', dataIndex: 'operFaultMsg' },
    { key: "operIp", title: 'IP地址', dataIndex: 'operIp' },
    { key: "createDate", title: '创建时间', dataIndex: 'createDate' },
  ];

  // 副作用
  useEffect(() => {
    logsApi.getLogs().then(res => {
      const withKeyData = res.data.map((item: any, index: number) => ({
        ...item,
        key: index
      }));
      setDataSource(withKeyData);
    });
  }, []);

  return (
    <Flex gap="middle" vertical justify="space-between" style={{ height: "100%" }}>
      <Table<LogItemType>
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
