import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { App, Button, DatePicker, Flex, Form, Input, InputNumber, Popconfirm, Select, Space, Table, TableColumnsType, TableProps, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { caseApi } from '@/request/api';
import { MatterItemType } from '@/utils/enum';
import dayjs from 'dayjs';
import { downLoadFile } from '@/utils/Functions';

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export default function Search() {
  const [searchForm] = Form.useForm();
  const navigateTo = useNavigate();
  const { message, notification } = App.useApp();
  const location = useLocation()
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

  const handleExport = async () => {
    const items = dataSource.filter((item) => selectedRowKeys.includes(item.key));
    const matterIds = items.map((item) => item.matterId);
    const res = await caseApi.exportMatter(matterIds, { responseType: 'blob' })
    downLoadFile(res)
    notification.success({
      message: '成功',
      description: '数据已导出'
    });
    setSelectedRowKeys([]);
  };

  const showTotal = (total: number) => `共 ${total} 条`;

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const refreshData = async () => {
    const res = await caseApi.getAll()
    setDataSource(res)
  };

  useEffect(() => {
    // if (location.state) {
    //   const { date, direction, cracked } = location.state
    //   if (date) {
    //     caseApi.combinationQuery({
    //       beginDate: date,
    //       endDate: date
    //     }).then((res) => {
    //       setDataSource(res)
    //     })
    //   }
    //   if (direction) {
    //     caseApi.combinationQuery({
    //       direction: direction
    //     }).then((res) => {
    //       setDataSource(res)
    //     })
    //   }   
    //   if (cracked) {
    //     caseApi.combinationQuery({
    //       cracked: cracked
    //     }).then((res) => {
    //       setDataSource(res)
    //     })
    //   }


    //   return
    // }
    refreshData();
  }, []);

  const handleDetail = (item: any) => {
    navigateTo('/data/update', {
      state: {
        matterNo: item.matterNo
      }
    });
  };

  const handleDelete = async (matterId: number) => {
    await caseApi.deleteMatter([matterId])
    notification.success({
      message: '删除成功',
      description: '数据删除成功'
    });
    searchForm.resetFields();
    refreshData();
    setSelectedRowKeys([]);
  };

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
    const items = dataSource.filter((item) => selectedRowKeys.includes(item.key));
    const matterIds = items.map((item) => item.matterId);
    await caseApi.deleteMatter(matterIds);
    notification.success({
      message: '删除成功',
      description: '数据删除成功'
    });
    searchForm.resetFields();
    refreshData();
    setSelectedRowKeys([]);
  };

  const handleSearch = async (searchForm: any) => {
    const res = await caseApi.combinationQuery(searchForm);
    setDataSource(res);
    notification.success({
      message: '查询成功',
      description: '数据已更新'
    });
  };

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'date';
    record: any;
    index: number;
  }

  const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let inputNode
    switch (inputType) {
      case 'number':
        inputNode = <InputNumber />
        break;
      case 'date':
        inputNode = <DatePicker />
        break;
      default:
        inputNode = <Input />
    }
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  }

  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<React.Key>('');
  const isEditing = (record: any) => record.key === editingKey;

  const handleEdit = (record: Partial<any> & { key: React.Key }) => {
    record.matterDate = dayjs(record.matterDate)
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (matterId: number) => {
    try {
      const row = (await form.validateFields()) as any;
      row.matterId = matterId
      await caseApi.updateMatter(row)
      notification.success({
        message: '修改成功',
        description: '数据修改成功'
      });
      refreshData();
    } catch (errInfo) {
      console.log('验证失败:', errInfo);
    }
  };

  const columns = [
    { key: "matterNo", title: '检案编号', dataIndex: 'matterNo', editable: true, sorter: (a: any, b: any) => a.matterNo.localeCompare(b.matterNo) },
    { key: "matterUnit", title: '委托单位', dataIndex: 'matterUnit', editable: true },
    { key: "matterItem", title: '委托事项', dataIndex: 'matterItem', editable: false },
    {
      key: "matterDate", title: '委托时间', dataIndex: 'matterDate', inputType: 'date', editable: true, sorter: (a: any, b: any) => new Date(a.matterDate).getTime() - new Date(b.matterDate).getTime(),
      render: (text: string) => dayjs(text).format("YYYY-MM-DD")
    },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type='link' onClick={() => save(record.matterId)}>
              <CheckCircleOutlined />保存
            </Button>
            <Button type='link' onClick={() => cancel()}>
              <CloseCircleOutlined />取消
            </Button>
          </Space>
        ) : (
          <Space>
            <Button type='link' onClick={() => handleDetail(record)} style={{ color: 'rgb(50,225,50)' }}>
              <EyeOutlined />详情
            </Button>
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
        )
      },
    },
  ];

  const mergedColumns: TableProps<any>['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: col.inputType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Flex gap="middle" vertical justify="space-between" style={{ height: "100%" }}>
      <Flex gap="middle" vertical>
        <Form
          layout="inline"
          form={searchForm}
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
            <Form.Item name="matterItem">
              <Select
                placeholder="委托事项"
                allowClear
                options={[
                  { value: MatterItemType.judicial, label: "司法鉴定" },
                  { value: MatterItemType.decryption, label: "破译解密" }
                ]}
              />
            </Form.Item>
            <Form.Item name="matterDateRange">
              <DatePicker.RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">组合查询</Button>
            </Form.Item>
          </Space>
        </Form>
        <Form form={form} component={false}>
          <Table<any>
            components={{
              body: { cell: EditableCell },
            }}
            bordered
            dataSource={dataSource}
            pagination={{
              current: params.current,
              pageSize: params.size,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: showTotal,
              onChange: handlePaginationChange,
            }}
            columns={mergedColumns}
            rowSelection={rowSelection}
            rowClassName="editable-row"
          />
        </Form>
      </Flex>
      <Space>
        <Button type="primary" onClick={handleSelectAll}>
          {isAllSelected ? "取消全选" : "全选"}
        </Button>
        <Button type="primary" onClick={handleExport}>
          批量导出
        </Button>
        <Popconfirm
          title="批量删除"
          description="确认删除所选案件?"
          onConfirm={handleMultipleDelete}
          okText="是"
          cancelText="否"
        >
          <Button type="primary" danger>
            批量删除
          </Button>
        </Popconfirm>
        {hasSelected && (
          <Tag icon={<CheckCircleOutlined />} color="success" bordered={false}>
            {`已选中 ${selectedRowKeys.length} 条`}
          </Tag>
        )}
      </Space>
    </Flex>
  );
}
