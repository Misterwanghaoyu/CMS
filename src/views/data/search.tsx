import { CheckCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { App, Button, Col, DatePicker, Flex, Form, Input, Popconfirm, Row, Select, Space, Table, TableColumnsType, TableProps, Tag } from 'antd'
import moment from 'moment';
import React, { ChangeEvent, ReactElement, useEffect, useMemo, useState } from 'react'

import ExcelJS from 'exceljs'
import { useNavigate } from 'react-router-dom';
import { exportAsExcel } from '@/utils/convertFunctions';
import axios from 'axios';
import { deleteCaseMultiple, deleteDecryptionCase, deleteJudicialCase, searchCase, updateCase } from '@/request/api';
import useCustomNotification from '@/hooks/useCustomNotification';
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
export default function Search() {
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
  const handleEdit = (item: CaseDataType) => {
    navigateTo('/data/update', {
      state: {
        editItem: item
      }
    })
  }
  const handleDelete = (item: CaseDataType) => {
    if (item.commission_matters === "司法鉴定") {
      deleteJudicialCase([item.judicial_id]).then(
        res => {
          notification.success({
            message: '成功',
            description: '数据删除成功'
          })
          form.resetFields()
        },
        rej => {
          notification.error({
            message: '错误',
            description: 'something wrong,request rejcted.'
          })
        }
      ).catch(err => {
        notification.error({
          message: '错误',
          description: err.message
        })
      }
      )
    } else {
      deleteDecryptionCase([item.decryption_id]).then(
        res => {
          notification.success({
            message: '成功',
            description: '数据删除成功'
          })
          form.resetFields()
        },
        rej => {
          notification.error({
            message: '错误',
            description: 'something wrong,request rejcted.'
          })
        }
      ).catch(err => {
        notification.error({
          message: '错误',
          description: err.message
        })
      }
      )
    }
  }
  const columns: TableColumnsType<CaseDataType> = [
    { key: 'case_id', title: '检案编号', dataIndex: 'case_id' },
    { key: "commission_unit", title: '委托单位', dataIndex: 'commission_unit' },
    { key: "enemy_direction", title: '敌情方向', dataIndex: 'enemy_direction' },
    { key: "commission_matters", title: '委托事项', dataIndex: 'commission_matters' },
    { key: "submit_person", title: '提交人', dataIndex: 'submit_person' },
    { key: "create_date", title: '创建时间', dataIndex: 'create_date' },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}><EditOutlined />编辑</Button>
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
    const fakeData = Array.from<CaseDataType>({ length: 46 }).map<CaseDataType>((_, i) => ({
      key: i,
      case_id: `${i}`,
      commission_unit: `委托单位 ${i}`,
      enemy_direction: `敌情方向${i}`,
      commission_matters: i % 2 === 1 ? `司法鉴定` : `破译解密`,
      submit_person: "why",
      create_date: moment(new Date()).format("YYYY-MM-DD"),
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
    deleteCaseMultiple(items)
  }

  const handleSearch = (searchForm: CaseSearchType) => {
    searchCase(searchForm).then(
      res => {
        notification.success({
          message: '成功',
          description: '数据已更新'
        })
        form.resetFields()
      },
      rej => {
        notification.error({
          message: '错误',
          description: 'something wrong,request rejcted.'
        })
      }
    ).catch(err => {
      notification.error({
        message: '错误',
        description: err.message
      })
    }
    )
  }
  return (
    <Space direction='vertical'>

      <Form
        layout="inline"
        form={form}
        style={{ width: "100%" }}
        initialValues={{ remember: true }}
        onFinish={handleSearch}
        autoComplete="off"
      >
        <Space>
          <Form.Item
            name="case_id"
          >
            <Input
              // value={params.name}
              // onChange={(e) => setParams({ ...params, name: e.target.value })}
              // style={{ width: "200px" }}
              allowClear
              placeholder="检案编号"
            />
          </Form.Item>
          <Form.Item
            name="commission_unit"
          >
            <Input
              // value={params.name}
              // onChange={(e) => setParams({ ...params, name: e.target.value })}
              allowClear
              placeholder="委托单位"
            />
          </Form.Item>
          <Form.Item
            name="enemy_direction"
          >
            <Input
              // value={params.name}
              // onChange={(e) => setParams({ ...params, name: e.target.value })}
              allowClear
              placeholder="敌情方向"
            />
          </Form.Item>
          <Form.Item
            name="submit_person"
          >

            <Input
              // value={params.name}
              // onChange={(e) => setParams({ ...params, name: e.target.value })}
              allowClear
              placeholder="提交人"
            />
          </Form.Item>
          <Form.Item
            name="commission_matters"
          >
            <Select
              placeholder={"委托事项"}
              allowClear
              onChange={() => { }}
              options={[
                {
                  value: "司法鉴定",
                  label: "司法鉴定",
                },
                {
                  value: "破译解密",
                  label: "破译解密",
                }
              ]}
            />
          </Form.Item>
          <Form.Item
            name="commission_date"
          >
            <DatePicker.RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              组合查询
            </Button>
          </Form.Item>
        </Space>
      </Form>
      <Flex gap="middle" vertical>
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
    </Space>
  )
}
