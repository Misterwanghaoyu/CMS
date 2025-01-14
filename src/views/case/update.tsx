import { Space, Button, Input, Select, DatePicker, Form, Flex, App, Table, Card, Popconfirm, } from 'antd';
import { useEffect, useState } from 'react'
import JudicialIdentificationForm from '@/components/JudicialIdentificationForm';
import DecryptionForm from '@/components/DecryptionForm';
import { DeleteOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { caseApi } from '@/request/api';
import { CrackedType, IdType, MatterItemType } from '@/utils/enum';
import dayjs from 'dayjs';
// 类型定义
interface JudicialDataType {
  matterId: number;
  judicialId: number;
  key: string;
  direction: string;
  subjectName: string;
  idType: IdType;
  idNumber: string;
  sampleCount: number;
  sampleVolume: number;
  description: string;
  workContent: string;
  workResult: string;
  submitUser: string;
  remarks: string;
}

interface DecryptionDataType {
  matterId: number;
  decryptionId: number;
  key: string;
  cracked: CrackedType;
  direction: string;
  encryptionType: string;
  feedback: string;
  fileName: string;
  plaintextPassword: string;
  remark: string;
  source: string;
  submitUser: string;
}
/**
 * 案件更新页面组件
 */
export default function DataUpdatePage() {
  // 路由相关
  const location = useLocation();
  const { notification } = App.useApp();

  // 状态定义
  const [commissionMatters, setCommissionMatters] = useState<MatterItemType>();
  const [data, setData] = useState<JudicialDataType[] | DecryptionDataType[]>([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<JudicialDataType | DecryptionDataType | null>(null);

  // Form实例
  const [commonFieldsForm] = Form.useForm();
  const [expandForm] = Form.useForm();



  // 方法定义
  const refetchData = async () => {
    const commonFieldsRes=await caseApi.getByMatterNo(`matterNo=${location.state.matterNo}`);
    const { matterNo, matterUnit, matterItem, matterDate, matterId } = commonFieldsRes[0];
    commonFieldsForm.setFieldsValue({
      matterId,
      matterNo,
      matterUnit,
      matterItem,
      matterDate: dayjs(matterDate)
    });
    setCommissionMatters(matterItem);
    let DetailFieldsRes: JudicialDataType[] | DecryptionDataType[] = [];
    if (matterItem === MatterItemType.judicial) {
      DetailFieldsRes = await caseApi.getJudicialMatterNo(`matterNo=${matterNo}`);
    } else {
      DetailFieldsRes = await caseApi.getDecryptionMatterNo(`matterNo=${matterNo}`);
    }
    setData(DetailFieldsRes);
  };
  const resetState = () => {
    setExpandedRowKeys([]);
    setExpandedRecord(null);
    refetchData();
  }
  const handleUpdateCase = async (caseForm: any) => {
    const reqData = {
      ...caseForm,
      ...(commissionMatters === MatterItemType.judicial
        ? { judicialList: [] }
        : { decryptionList: [] })
    };

    await (commissionMatters === MatterItemType.judicial
      ? caseApi.updateJudicialMatter(reqData)
      : caseApi.updateDecryptionMatter(reqData));

    notification.success({
      message: "成功",
      description: "保存成功"
    });
    location.state.matterNo=caseForm.matterNo;
    resetState()
  };

  const handleDelete = async (matterId: number) => {
    if (commissionMatters === MatterItemType.judicial) {
      await caseApi.delJudicial([matterId]);
    } else {
      await caseApi.delDecryption([matterId]);
    }
    notification.success({
      message: "成功",
      description: "删除成功"
    });
    resetState();
  };

  const handleSaveExpand = async (values: any) => {
    const reqData = {
      ...commonFieldsForm.getFieldsValue(),
      ...(commissionMatters === MatterItemType.judicial
        ? { judicialList: [values] }
        : { decryptionList: [values] })
    };

    await (commissionMatters === MatterItemType.judicial
      ? caseApi.updateJudicialMatter(reqData)
      : caseApi.updateDecryptionMatter(reqData));

    notification.success({
      message: "成功",
      description: "保存成功"
    });
    resetState();
  };

  // 表格列配置
  const columns = commissionMatters === MatterItemType.judicial ? [
    // { key: 'key', title: '序号', dataIndex: 'key', inputType: "number", editable: false }, 
    { key: "direction", title: '敌情方向', dataIndex: 'direction', editable: true },
    { key: "subjectName", title: '对象姓名', dataIndex: 'subjectName', editable: true },
    { key: "idType", title: '证件类型', dataIndex: 'idType', editable: true, inputType: "select" },
    { key: "idNumber", title: '证件号码', dataIndex: 'idNumber', editable: true },
    { key: "sampleCount", title: '检材数量', dataIndex: 'sampleCount', inputType: "number", editable: true },
    { key: "sampleVolume", title: '检材容量', dataIndex: 'sampleVolume', inputType: "number", editable: true },
    // { key: "description", title: '案情简介', dataIndex: 'description', editable: true, inputType: "textarea" },
    // { key: "workContent", title: '工作内容', dataIndex: 'workContent', editable: true, inputType: "textarea" },
    // { key: "workResult", title: '工作成果', dataIndex: 'workResult', editable: true, inputType: "textarea" },
    // { key: "remarks", title: '备注', dataIndex: 'remarks', editable: true, inputType: "textarea" },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: JudicialDataType | DecryptionDataType) => (
        <Space>
          <Popconfirm
            title="删除案件"
            description="确认删除?"
            onConfirm={() => handleDelete((record as JudicialDataType).judicialId)}
            okText="是"
            cancelText="否"
          >
            <Button type='link' danger>
              <DeleteOutlined />删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ] : [
    // { key: 'key', title: '序号', dataIndex: 'key', inputType: "number", editable: false },
    { key: "submitUser", title: '提交人', dataIndex: 'submitUser', editable: true },
    { key: "direction", title: '敌情方向', dataIndex: 'direction', editable: true },
    { key: "fileName", title: '文件名', dataIndex: 'fileName', editable: true },
    { key: "encryptionType", title: '加密类型', dataIndex: 'encryptionType', editable: true },
    { key: "source", title: '来源', dataIndex: 'source', editable: true },
    { key: "cracked", title: '是否破译', dataIndex: 'cracked', editable: true, inputType: "select" },
    { key: "plaintextPassword", title: '明文密码', dataIndex: 'plaintextPassword', editable: true },
    // { key: "feedback", title: '反馈', dataIndex: 'feedback', editable: true, inputType: "textarea" },
    // { key: "remark", title: '备注', dataIndex: 'remark', editable: true, inputType: "textarea" },
    {
      key: "operation",
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: JudicialDataType | DecryptionDataType) => (
        <Space>
          <Popconfirm
            title="删除案件"
            description="确认删除?"
            onConfirm={() => handleDelete((record as DecryptionDataType).decryptionId)}
            okText="是"
            cancelText="否"
          >
            <Button type='link' danger>
              <DeleteOutlined />删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  // Effects
  useEffect(() => {
    refetchData();
  }, []);

  useEffect(() => {
    if (expandedRecord) {
      expandForm.setFieldsValue(expandedRecord);
    }
  }, [expandedRecord]);

  return (
    <Card title={
      <Form
        layout="inline"
        form={commonFieldsForm}
        initialValues={{ remember: true }}
        onFinish={handleUpdateCase}
        autoComplete="off"
      >
         <Form.Item
            name="matterId"
            hidden
          >
            <Input />
          </Form.Item>
        <Flex justify='space-between' style={{ width: '100%' }}>
          <Form.Item
            label="委托事项"
            name="matterItem"
            // rules={[{ required: true, message: "请选择委托事项" }]}
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
            // rules={[{ required: true, message: "请输入委托单位" }]}
          >
            <Input placeholder="请输入委托单位" disabled/>
          </Form.Item>

          <Form.Item
            label="检案编号"
            name="matterNo"
            // rules={[{ required: true, message: "请输入检案编号" }]}
          >
            <Input placeholder="请输入检案编号"  disabled/>
          </Form.Item>

          <Form.Item
            label="委托日期"
            name="matterDate"
            // rules={[{ required: true, message: "请输入委托日期" }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请输入委托日期" disabled/>
          </Form.Item>
          {/* <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item> */}
        </Flex>
      </Form>
    }
    >
      <Table<JudicialDataType | DecryptionDataType>
        expandable={{
          expandedRowRender: (record) => {
            return <Form form={expandForm} component={false} onFinish={handleSaveExpand}>
              {commissionMatters === MatterItemType.judicial ?
                <JudicialIdentificationForm /> :
                <DecryptionForm crack={(record as DecryptionDataType).cracked} form={expandForm} />
              }
              {commissionMatters === MatterItemType.judicial ?
                <Form.Item name="judicialId" hidden>
                  <Input />
                </Form.Item> :
                <Form.Item name="decryptionId" hidden>
                  <Input />
                </Form.Item>
              }
              <Form.Item name="matterId" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="submitUser" hidden>
                <Input />
              </Form.Item>
              <Form.Item>
                <Space style={{ display: "flex", justifyContent: "right" }}>
                <Button type="primary" onClick={() => expandForm.submit()}>保存</Button>
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
