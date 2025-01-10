import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { App, Button, DatePicker, Flex, Form, Input, InputNumber, Popconfirm, Select, Space, Table, TableColumnsType, TableProps, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { caseApi } from '@/request/api';
import { MatterItemType } from '@/utils/enum';
const downLoadFile = function (res: any) {
  const headers = res.headers;
  const contentType = headers['Content-Type'];
  const blob = new Blob([res.data], { type: contentType });
  //下载后文件名
  let fileName = "exported_data.xlsx"
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];

export default function Search() {
  const [searchForm] = Form.useForm();
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

    // const judicialItems = items.filter((item) => item.matterItem === MatterItemType.judicial);
    // const decryptionItems = items.filter((item) => item.matterItem === MatterItemType.decryption);

    // const judicialItemsId = judicialItems.map((item) => item.matterId);
    // const decryptionItemsId = decryptionItems.map((item) => item.matterId);
    // const reqData = [judicialItemsId, decryptionItemsId]

    const res = await caseApi.exportMatter(matterIds, { responseType: 'blob' })
    downLoadFile(res)
    notification.success({
      message: '成功',
      description: '数据已导出'
    });
    // try {
    //   const [judicialResults, decryptionResults] = await Promise.all([
    //     Promise.all(judicialItemsId.map(id => caseApi.getJudicialById(`matterId=${id}&judicialId=1`))),
    //     Promise.all(decryptionItemsId.map(id => caseApi.getDecryptionById(`matterId=${id}&decryptionId=1`)))
    //   ]);

    //   // const exportData1 = judicialResults.map(res => res.data);
    //   // const exportData2 = decryptionResults.map(res => res.data);

    //   // exportAsExcel(judicialResults, decryptionResults, matterIds);
    // } catch (err: any) {
    //   notification.error({
    //     message: '导出失败',
    //     description: err.message
    //   });
    // }
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
    const res = await caseApi.getAll()
    setDataSource(res)
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDetail = (item: any) => {
    navigateTo('/data/update', {
      state: {
        matterNo: item.matterNo
      }
    });
  };
  // 删除操作
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
    inputType: 'number' | 'text';
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
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
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
      console.log('Validate Failed:', errInfo);
    }
  };
  const columns = [
    // { key: 'matterId', title: '序号', dataIndex: 'matterId' },
    { key: "matterNo", title: '检案编号', dataIndex: 'matterNo', editable: true },
    { key: "matterUnit", title: '委托单位', dataIndex: 'matterUnit', editable: true },
    { key: "matterItem", title: '委托事项', dataIndex: 'matterItem', editable: false },
    // { key: "submitUser", title: '提交人', dataIndex: 'submitUser' },
    { key: "matterDate", title: '委托时间', dataIndex: 'matterDate', editable: true },
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
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
            {/* <Form.Item name="direction">
              <Input allowClear placeholder="敌情方向" />
            </Form.Item> */}
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
        {/* <Table<any>
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
        /> */}
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
