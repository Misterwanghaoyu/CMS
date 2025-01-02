import { Space, Button, Row, Col, Input, Select, DatePicker, Form, Typography, Flex, App } from 'antd';
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import JudicialIdentificationForm from '@/components/JudicialIdentificationForm';
import DecryptionForm from '@/components/DecryptionForm';
import { UploadOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { caseApi } from '@/request/api';
import { parseExcel } from '@/utils/convertFunctions';
import dayjs from 'dayjs';
export default function DataUpdatePage() {
  const location = useLocation();
  const { notification } = App.useApp();
  const navigatorTo = useNavigate()
  const [commissionMatters, setCommissionMatters] = useState<1 | 2 | undefined>(location.state?.editItem.commission_matters)
  const [editRowData] = useState<any>({ cracked: false })
  const [form] = Form.useForm();
  const handleReturn = () => {
    form.resetFields()
    navigatorTo(-1)
  }
  useEffect(() => {
    if (location.state) {
      const { editItem } = location.state
      if (editItem.matterItem === 1) {
        setCommissionMatters(1)
        caseApi.getJudicialById(`matterId=${editItem.matterId}&judicialId=1`).then(res => {
          form.setFieldsValue(res.data)
        })
      } else if (editItem.matterItem === 2) {
        setCommissionMatters(2)
        caseApi.getDecryptionById(`matterId=${editItem.matterId}&decryptionId=1`).then(res => {
          form.setFieldsValue(res.data)
        })
      }
    }
  }, [])
  const whichForm = useMemo(() => {
    if (commissionMatters === 1) return <JudicialIdentificationForm />
    else if (commissionMatters === 2) return <DecryptionForm />
    else return <></>
  }, [commissionMatters, editRowData])
  const handleUpdateCase = async (caseForm: any) => {
    caseForm.matterId = location.state?.editItem.matterId
    caseForm.matterDate = dayjs(caseForm.matterDate).format("YYYY-MM-DD HH:mm:ss")
    if(commissionMatters === 1){
      caseApi.updateJudicial(caseForm).then(res=>{
        if(res.code === 0){
          notification.success({
            message: '成功',
            description: '数据更新成功'
          })
          navigatorTo(-1)
        }else{
          notification.error({
            message: '失败',
            description: res.message
          })
        }
      }).catch(err=>{
        notification.error({
          message: '失败',
          description: err.message
        })
      })
    }else if(commissionMatters === 2){
      caseApi.updateDecryption(caseForm).then(res=>{
        if(res.code === 0){
          notification.success({
            message: '成功',
            description: '数据更新成功'
          })
          navigatorTo(-1)
        }else{
          notification.error({
            message: '失败',
            description: res.message
          })
        }
      }).catch(err=>{
        notification.error({
          message: '失败',
          description: err.message
        })  
      })
    }
  };

  const handleImportSuccess = () => {
    notification.success({
      message: '成功',
      description: '数据导入成功'
    })
  }

  const handleImportError = (error: any) => {
    notification.error({
      message: '错误',
      description: error.message || '导入失败'
    })
  }
  const importExcel = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const result = await parseExcel(e) as [any[], any[]];
      const [judicialData, decryptionData] = result;

      if (judicialData.length > 0) {
        const res = await caseApi.importJudicialExcel(judicialData)
        if (res.code === 0) {
          handleImportSuccess()
        } else {
          handleImportError(res)
        }
      }

      if (decryptionData.length > 0) {
        const res = await caseApi.importDecryptionExcel(decryptionData)
        if (res.code === 0) {
          handleImportSuccess()
        } else {
          handleImportError(res)
        }
      }
    } catch (err: any) {
      handleImportError(err)
    }
  }

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
        <Button>
          <input
            type="file"
            onChange={importExcel}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer"
            }}
          />
          <UploadOutlined />
          <Typography.Paragraph style={{ margin: 0 }}>导入 Excel 文件</Typography.Paragraph>
        </Button>
      </Flex>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="委托事项"
            name="matterItem"
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
                  value: 1,
                  label: "司法鉴定",
                },
                {
                  value: 2,
                  label: "破译解密",
                }
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="委托单位"
            name="matterUnit"
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
            name="matterNo"
            rules={[{ required: true, message: "请输入检案编号" }]}
          >
            <Input placeholder="请输入检案编号" />
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item
            label="委托日期"
            name="matterDate"
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
