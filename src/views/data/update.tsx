import { Space, Button, Row, Col, Input, Select, DatePicker, Form, Typography, Flex } from 'antd';
import { useEffect, useMemo, useState } from 'react'
import JudicialIdentificationForm from '@/components/JudicialIdentificationForm';
import DecryptionForm from '@/components/DecryptionForm';
import { UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { importExcel } from '@/utils/convertFunctions';
import { updateCase } from '@/request/api';
export default function DataUpdatePage() {
  const location = useLocation();
  const navigatorTo=useNavigate()
  const [commissionMatters, setCommissionMatters] = useState<string | undefined>(location.state?.editItem.commission_matters)
  const [editRowData] = useState<any>({ is_cracking: false })
  const [form] = Form.useForm();
  const handleReturn = () => {
    form.resetFields()
    navigatorTo(-1)
  }
  useEffect(()=>{
    if(location.state){
      form.setFieldsValue(location.state.editItem)
    }
  })
  const whichForm = useMemo(() => {
    if (commissionMatters === "司法鉴定") return <JudicialIdentificationForm />
    else if (commissionMatters === "破译解密") return <DecryptionForm isCrakingProp={editRowData.is_cracking} />
    else return <></>
  }, [commissionMatters, editRowData])
  const handleUpdateCase = async (caseForm: any) => {
    updateCase(caseForm)
  };


  return (
    <Form
      layout="vertical"
      form={form}
      style={{ maxWidth: "90%" }}
      initialValues={{ remember: true }}
      onFinish={handleUpdateCase}
      autoComplete="off"
    >
      <Flex justify='space-between'>
        <Typography.Title level={5} style={{ margin: "0 0 10px 0" }}>基本信息</Typography.Title>
        <Button >
          <input type="file" onChange={importExcel} style={{ position: "absolute", width: "100%", height: "100%", opacity: 0, cursor: "pointer" }} />
          <UploadOutlined />
          <Typography.Paragraph style={{ margin: 0 }}>导入 Excel 文件</Typography.Paragraph>
        </Button>
      </Flex>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="委托事项"
            name="commission_matters"
            rules={[{ required: true, message: "请选择委托事项" }]}
          >
            <Select
              style={{
                width: "100%",
              }}
              placeholder={"选择类别"}
              allowClear
              onChange={(value) => setCommissionMatters(value)}
              value={commissionMatters}
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
        </Col>
        <Col span={10}>
          <Form.Item
            label="委托单位"
            name="commission_unit"
            rules={[{ required: true, message: "请输入委托单位" }]}
          >
            <Input placeholder="请输入委托单位" />
          </Form.Item>
        </Col>

      </Row>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="检案编号"
            name="case_id"
            rules={[{ required: true, message: "请输入检案编号" }]}
          >
            <Input placeholder="请输入检案编号" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item
            label="委托日期"
            name="commission_date"
            rules={[{ required: true, message: "请输入委托日期" }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="请输入委托日期" />
          </Form.Item>
        </Col>
      </Row>
      {whichForm}
      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "right" }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={handleReturn}>
            返回
          </Button>
        </Space>
      </Form.Item>
    </Form>

  )
}
