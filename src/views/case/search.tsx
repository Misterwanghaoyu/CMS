import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { App, Button, DatePicker, Flex, Form, Input, Popconfirm, Select, Space, Table, TableColumnsType, TableProps, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportAsExcel } from '@/utils/convertFunctions';
import { caseApi } from '@/request/api';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export default function Search() {
  const [form] = Form.useForm();
  const navigateTo = useNavigate();
  const { message, notification } = App.useApp();

  const [isAllSelected, setIsAllSelected] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    name: "",
    code: "",
  });

  const total = useMemo(() => dataSource.length, [dataSource]);
  const hasSelected = selectedRowKeys.length > 0;

  // 导出数据
  const handleExport = async () => {
    const items = dataSource.filter((item) => selectedRowKeys.includes(item.key));
    const matterIds = items.map((item) => item.matterId);

    const judicialItems = items.filter((item) => item.matterItem === 1);
    const decryptionItems = items.filter((item) => item.matterItem === 2);

    const judicialItemsId = judicialItems.map((item) => item.matterId);
    const decryptionItemsId = decryptionItems.map((item) => item.matterId);

    try {
      const [judicialResults, decryptionResults] = await Promise.all([
        Promise.all(judicialItemsId.map(id => caseApi.getJudicialById(`matterId=${id}&judicialId=1`))),
        Promise.all(decryptionItemsId.map(id => caseApi.getDecryptionById(`matterId=${id}&decryptionId=1`)))
      ]);

      const exportData1 = judicialResults.map(res => res.data);
      const exportData2 = decryptionResults.map(res => res.data);

      exportAsExcel(exportData1, exportData2, matterIds);
    } catch (err: any) {
      notification.error({
        message: '导出失败',
        description: err.message
      });
    }
  };

  // 展示总条数
  const showTotal = (total: number) => `共 ${total} 条`;

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 刷新数据
  const refreshData = async () => {
    try {
      const res = await caseApi.getAll();
      if (res.code === 0) {
        const withKeyData = res.data.map((item: any, index: number) => ({
          ...item,
          key: index
        }));
        setDataSource(withKeyData);
      } else {
        notification.error({
          message: '获取数据失败',
          description: res.message
        });
      }
    } catch (err: any) {
      notification.error({
        message: '获取数据失败',
        description: err.message
      });
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // 编辑操作
  const handleEdit = (item: any) => {
    navigateTo('/data/update', {
      state: {
        editItem: item
      }
    });
  };

  // 删除操作
  const handleDelete = async (matterId: number) => {
    try {
      const res = await caseApi.delete([matterId]);
      if (res.code === 0) {
        notification.success({
          message: '删除成功',
          description: '数据删除成功'
        });
        form.resetFields();
        refreshData();
      } else {
        notification.error({
          message: '删除失败',
          description: res.message
        });
      }
    } catch (err: any) {
      notification.error({
        message: '删除失败',
        description: err.message
      });
    }
  };

  const columns: TableColumnsType<any> = [
    { key: 'matterId', title: '序号', dataIndex: 'matterId' },
    { key: "matterNo", title: '检案编号', dataIndex: 'matterNo' },
    { key: "matterUnit", title: '委托单位', dataIndex: 'matterUnit' },
    {
      key: "matterItem",
      title: '委托事项',
      dataIndex: 'matterItem',
      render: (_, record) => record.matterItem === 1 ? "司法鉴定" : "破译解密"
    },
    { key: "submitUser", title: '提交人', dataIndex: 'submitUser' },
    { key: "matterDate", title: '创建时间', dataIndex: 'matterDate' },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            <EditOutlined />编辑
          </Button>
          <Popconfirm
            title="删除案件"
            description="确认删除此案件?"
            onConfirm={() => handleDelete(record.matterId)}
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

  const handleMultipleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      return message.error("请至少选择一条数据");
    }

    try {
      const items = dataSource.filter((item) => selectedRowKeys.includes(item.key));
      const matterIds = items.map((item) => item.matterId);

      const res = await caseApi.deleteMultiple(matterIds);
      if (res.code === 0) {
        notification.success({
          message: '删除成功',
          description: '数据删除成功'
        });
        form.resetFields();
        refreshData();
      } else {
        notification.error({
          message: '删除失败',
          description: res.message
        });
      }
    } catch (err: any) {
      notification.error({
        message: '删除失败',
        description: err.message
      });
    }
  };

  const handleSearch = async (searchForm: any) => {
    if (searchForm.commission_date) {
      searchForm.beginDate = searchForm.commission_date[0].format("YYYY-MM-DD HH:mm:ss");
      searchForm.endDate = searchForm.commission_date[1].format("YYYY-MM-DD HH:mm:ss");
      delete searchForm.commission_date;
    }

    try {
      const res = await caseApi.combinationQuery(searchForm);
      if (res.code === 0) {
        setDataSource(res.data);
        notification.success({
          message: '查询成功',
          description: '数据已更新'
        });
      }
    } catch (err: any) {
      notification.error({
        message: '查询失败',
        description: err.message
      });
    }
  };

  return (
    <Flex gap="middle" vertical justify="space-between" style={{ height: "100%" }}>
      <Flex gap="middle" vertical>
        <Form
          layout="inline"
          form={form}
          style={{ width: "100%" }}
          initialValues={{ remember: true }}
          onFinish={handleSearch}
          autoComplete="off"
        >
          <Space>
            <Form.Item name="matterNo">
              <Input allowClear placeholder="检案编号" />
            </Form.Item>
            <Form.Item name="matterUnit">
              <Input allowClear placeholder="委托单位" />
            </Form.Item>
            <Form.Item name="direction">
              <Input allowClear placeholder="敌情方向" />
            </Form.Item>
            <Form.Item name="matterItem">
              <Select
                placeholder="委托事项"
                allowClear
                options={[
                  { value: "1", label: "司法鉴定" },
                  { value: "2", label: "破译解密" }
                ]}
              />
            </Form.Item>
            <Form.Item name="commission_date">
              <DatePicker.RangePicker showTime />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">组合查询</Button>
            </Form.Item>
          </Space>
        </Form>
        <Table<any>
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
      </Flex>
      <Space>
        <Button type="primary" onClick={handleSelectAll}>
          {isAllSelected ? "取消全选" : "全选"}
        </Button>
        <Button type="primary" onClick={handleMultipleDelete}>
          批量删除
        </Button>
        <Button type="primary" onClick={handleExport}>
          批量导出
        </Button>
        {hasSelected && (
          <Tag icon={<CheckCircleOutlined />} color="success" bordered={false}>
            {`已选中 ${selectedRowKeys.length} 条`}
          </Tag>
        )}
      </Space>
    </Flex>
  );
}
