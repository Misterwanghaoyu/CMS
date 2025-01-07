import { Space, Button, Input, Select, DatePicker, Form, Flex, App, Table, Card, Popconfirm } from 'antd';
import { useEffect, useState } from 'react'
import JudicialIdentificationForm from '@/components/JudicialIdentificationForm';
import DecryptionForm from '@/components/DecryptionForm';
import { DeleteOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { caseApi } from '@/request/api';
import { IdType, MatterItemType } from '@/utils/enum';
import dayjs from 'dayjs';

/**
 * 案件更新页面组件
 */
export default function DataUpdatePage() {
  // 获取路由信息
  const location = useLocation();
  const { editItem } = location.state
  // 路由导航
  const navigatorTo = useNavigate()
  // 委托事项状态
  const [commissionMatters, setCommissionMatters] = useState<MatterItemType>(editItem.matterItem)
  // 表单实例
  const [commonFieldsForm] = Form.useForm();
  // 展开行表单实例
  const [expandForm] = Form.useForm();

  /**
   * 初始化加载表单数据
   */
  const refetchData = async () => {
    if (editItem) {
      let res: JudicialDataType[] | DecryptionDataType[] = []
      if (commissionMatters === MatterItemType.judicial) {
        res = await caseApi.getJudicialMatterNo(`matterNo=${editItem.matterNo}`)
      } else if (commissionMatters === MatterItemType.decryption) {
        res = await caseApi.getDecryptionMatterNo(`matterNo=${editItem.matterNo}`)
      }
      const { matterNo, matterUnit, matterItem, matterDate } = editItem
      commonFieldsForm.setFieldsValue({
        matterNo,
        matterUnit,
        matterItem,
        matterDate: dayjs(matterDate)
      })
      setData(res)
    }
  }
  useEffect(() => {
    refetchData()
  }, [])

  /**
   * 更新案件处理函数
   */
  const handleUpdateCase = async (caseForm: any) => {
    console.log(caseForm);
  };

  /**
   * 删除案件处理函数
   */
  const handleDelete = async (key: string) => {
    const newData = data.filter(item => item.key !== key);
    setData(newData as any);
  };

  /**
   * 表格1数据类型接口
   */
  interface JudicialDataType {
    key: string;
    direction: string; // 敌情方向
    subjectName: string; // 对象姓名
    idType: IdType; // 证件类型
    idNumber: string; // 证件号码
    sampleCount: number; // 检材数量
    sampleVolume: number; // 检材容量
    description: string; // 案情简介
    workContent: string; // 工作内容
    workResult: string; // 工作成果
    submitUser: string; // 提交人
    remarks: string; // 备注
    // judicialId: number; // 司法鉴定ID
    // matterId: number; // 案件ID
    // matterDate: Date | null; // 案件日期
    // matterItem: string | null; // 委托事项
    // matterNo: string | null; // 案件编号
    // matterUnit: string | null; // 委托单位
  }

  /**
   * 表格2数据类型接口
   */
  interface DecryptionDataType {
    key: string;
    cracked: number; // 是否破译
    // decryptionId: number; // 破译ID
    direction: string; // 敌情方向
    encryptionType: string; // 加密类型
    feedback: string; // 反馈
    fileName: string; // 文件名
    matterId: number; // 案件ID
    plaintextPassword: string; // 明文密码
    remark: string; // 备注
    source: string; // 来源
    submitUser: string // 提交人
  }


  /**
   * 生成初始表格数据
   */
  // const originData = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  //   key: i.toString(),
  //   direction: `敌情方向${i}`,
  //   subjectName: `对象姓名${i}`,
  //   idType: i % 2 === 0 ? 1 : 2,
  //   idNumber: `证件号码${i}`,
  //   sampleCount: i,
  //   sampleVolume: i,
  //   description: `案情简介${i}`,
  //   workContent: `工作内容${i}`,
  //   workResult: `工作成果${i}`,
  //   remarks: `备注${i}`,
  // }));

  // 表格数据状态
  const [data, setData] = useState<JudicialDataType[] | DecryptionDataType[]>([]);
  // 展开行的key数组
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  // 当前展开行的记录
  const [expandedRecord, setExpandedRecord] = useState<JudicialDataType | DecryptionDataType | null>(null);

  /**
   * 表格列配置
   */
  const columns = commissionMatters === MatterItemType.judicial ? [
    { key: 'key', title: '序号', dataIndex: 'key', inputType: "number", editable: false },
    { key: "direction", title: '敌情方向', dataIndex: 'direction', editable: true },
    { key: "subjectName", title: '对象姓名', dataIndex: 'subjectName', editable: true },
    { key: "idType", title: '证据类型', dataIndex: 'idType', editable: true, inputType: "select" },
    { key: "idNumber", title: '证件号码', dataIndex: 'idNumber', editable: true },
    { key: "sampleCount", title: '检材数量', dataIndex: 'sampleCount', inputType: "number", editable: true },
    { key: "sampleVolume", title: '检材容量', dataIndex: 'sampleVolume', inputType: "number", editable: true },
    { key: "description", title: '案情简介', dataIndex: 'description', editable: true, inputType: "textarea" },
    { key: "workContent", title: '工作内容', dataIndex: 'workContent', editable: true, inputType: "textarea" },
    { key: "workResult", title: '工作成果', dataIndex: 'workResult', editable: true, inputType: "textarea" },
    { key: "remarks", title: '备注', dataIndex: 'remarks', editable: true, inputType: "textarea" },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: JudicialDataType | DecryptionDataType) => {
        return (
          <Space>
            <Popconfirm
              title="删除案件"
              description="确认删除此案件?"
              onConfirm={() => handleDelete(record.key)}
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
    }
  ] : [
    { key: 'key', title: '序号', dataIndex: 'key', inputType: "number", editable: false },
    { key: "direction", title: '敌情方向', dataIndex: 'direction', editable: true },
    { key: "cracked", title: '是否破译', dataIndex: 'cracked', editable: true, inputType: "select" },
    { key: "plaintextPassword", title: '明文密码', dataIndex: 'plaintextPassword', editable: true },
    { key: "encryptionType", title: '加密类型', dataIndex: 'encryptionType', editable: true },
    { key: "feedback", title: '反馈', dataIndex: 'feedback', editable: true, inputType: "textarea" },
    { key: "fileName", title: '文件名', dataIndex: 'fileName', editable: true },
    { key: "source", title: '来源', dataIndex: 'source', editable: true },
    { key: "submitUser", title: '提交人', dataIndex: 'submitUser', editable: true },
    { key: "remark", title: '备注', dataIndex: 'remark', editable: true, inputType: "textarea" },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: JudicialDataType | DecryptionDataType) => {
        return (
          <Space>
            <Popconfirm
              title="删除案件"
              description="确认删除此案件?"
              onConfirm={() => handleDelete(record.key)}
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
    }
  ];

  /**
   * 展开行数据变化时更新表单
   */
  useEffect(() => {
    if (expandedRecord) {
      expandForm.setFieldsValue(expandedRecord);
    }
  }, [expandedRecord]);
  const handleSaveExpand = async (values: any) => {
    console.log(values);
  }

  return (
    <Card title={
      <Form
        layout="inline"
        form={commonFieldsForm}
        initialValues={{ remember: true }}
        onFinish={handleUpdateCase}
        autoComplete="off"
      >
        <Flex justify='space-between' style={{ width: '100%' }}>
          <Form.Item
            label="委托事项"
            name="matterItem"
            rules={[{ required: true, message: "请选择委托事项" }]}
          >
            <Select
              style={{
                width: "100%",
              }}
              disabled
              placeholder={"选择类别"}
              allowClear
              onChange={(value) => setCommissionMatters(value)}
              value={commissionMatters}
              options={[
                {
                  value: MatterItemType.judicial,
                  label: "司法鉴定",
                },
                {
                  value: MatterItemType.decryption,
                  label: "破译解密",
                }
              ]}
            />
          </Form.Item>
          <Form.Item
            label="委托单位"
            name="matterUnit"
            rules={[{ required: true, message: "请输入委托单位" }]}
          >
            <Input placeholder="请输入委托单位" />
          </Form.Item>

          <Form.Item
            label="检案编号"
            name="matterNo"
            rules={[{ required: true, message: "请输入检案编号" }]}
          >
            <Input placeholder="请输入检案编号" />
          </Form.Item>

          <Form.Item
            label="委托日期"
            name="matterDate"
            rules={[{ required: true, message: "请输入委托日期" }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请输入委托日期" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Flex>
      </Form>
    }
    >
      <Table<JudicialDataType | DecryptionDataType>
        expandable={{
          expandedRowRender: (record) => {
            return <Form form={expandForm} component={false} onFinish={handleSaveExpand}>
              {commissionMatters === MatterItemType.judicial ? <JudicialIdentificationForm /> : <DecryptionForm form={expandForm} />}
              <Form.Item>
                <Space style={{ display: "flex", justifyContent: "right" }}>
                  <Button type="primary" htmlType="submit" onClick={() => expandForm.submit()}>暂存</Button>
                  <Button onClick={() => expandForm.resetFields()}>重置</Button>
                  <Button onClick={() => {
                    setExpandedRowKeys([]);
                    setExpandedRecord(null);
                  }}>取消</Button>
                </Space>
              </Form.Item>
            </Form>
          },
          expandedRowKeys: expandedRowKeys
        }}
        bordered
        dataSource={data}
        columns={columns}
        rowClassName="editable-row"
        onRow={(record) => ({
          onClick: () => {
            const key = record.key as string;
            const expanded = expandedRowKeys.includes(key);
            if (expanded) {
              setExpandedRowKeys([]);
              setExpandedRecord(null);
            } else {
              setExpandedRowKeys([key]);
              setExpandedRecord(record);
            }
          }
        })}
      />
    </Card>
  )
}
