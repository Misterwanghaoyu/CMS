import { Space, Button, Row, Col, Input, Select, DatePicker, Form, Typography, Flex, App, AutoComplete, AutoCompleteProps } from 'antd';
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import JudicialIdentificationForm from '@/components/JudicialIdentificationForm';
import DecryptionForm from '@/components/DecryptionForm';
import { UploadOutlined } from '@ant-design/icons';
import { parseExcel } from '@/utils/convertFunctions';
import { caseApi } from '@/request/api';
import { MatterItemType } from '@/utils/enum';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
export default function DataAddPage() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const { name: realName } = JSON.parse(localStorage.getItem("userInfo")!)
  const [commissionMatters, setCommissionMatters] = useState<MatterItemType>()

  const handleCancle = () => {
    setCommissionMatters(undefined)
    form.resetFields()
  }

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

  const whichForm = useMemo(() => {
    if (commissionMatters === MatterItemType.judicial) return <JudicialIdentificationForm />
    if (commissionMatters === MatterItemType.decryption) return <DecryptionForm form={form} />
    return <></>
  }, [commissionMatters])

  const handleAddCase = async (caseForm: any) => {
    const matterNo = form.getFieldValue('matterNo')
    const matterItem = form.getFieldValue('matterItem')
    const matterUnit = form.getFieldValue('matterUnit')
    const matterDate = form.getFieldValue('matterDate')


    form.resetFields();
    form.setFieldsValue({
      matterNo: matterNo,
      matterItem: matterItem,
      matterUnit: matterUnit,
      matterDate: matterDate
    });
    const api = commissionMatters === MatterItemType.judicial ? caseApi.addJudicial : caseApi.addDecryption
    await api(caseForm)
    notification.success({
      message: '成功',
      description: '数据新增成功'
    })
    // try {

    //   const api = commissionMatters === MatterItemType.judicial ? caseApi.addJudicial : caseApi.addDecryption
    //   const res = await api(caseForm)

    //   if (res.code === 0) {
    //     notification.success({
    //       message: '成功',
    //       description: '数据新增成功'
    //     })
    //     // form.setFieldsValue({
    //     //   matterNo: form.getFieldValue('matterNo'),
    //     //   matterItem: form.getFieldValue('matterItem'), 
    //     //   matterUnit: form.getFieldValue('matterUnit'),
    //     //   matterDate: form.getFieldValue('matterDate')
    //     // });
    //     // form.resetFields(['submitUser']);
    //   } else {
    //     notification.error({
    //       message: '错误',
    //       description: res.message
    //     })
    //   }
    // } catch (err: any) {
    //   notification.error({
    //     message: '错误',
    //     description: err.message
    //   })
    // }
  }
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutoCompleteProps['options']>([]);

  const handleMatterNoChange = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        form.resetFields();
        setCommissionMatters(undefined)
        return;
      }

      const res = await caseApi.getByMatterNo(`matterNo=${value}`);

      if (res.length === 0) {
        form.setFieldsValue({
          matterUnit: '',
          matterItem: undefined,
          matterDate: ''
        });
        setCommissionMatters(undefined)
        return;
      }

      setAutocompleteOptions(res.map((item: any) => ({
        label: item.matterNo,
        value: item.matterNo,
      })));
    }, 1000),
    [form]
  );

  const handleMatterNoSelect = async (value: string) => {
    const res = await caseApi.getByMatterNo(`matterNo=${value}`);
    const { matterUnit, matterItem, matterDate } = res[0];

    form.setFieldsValue({
      matterUnit,
      matterItem,
      matterDate: dayjs(matterDate)
    });
    setCommissionMatters(matterItem)
  }
  return (
    <Form
      layout="vertical"
      form={form}
      style={{ maxWidth: "90%" }}
      initialValues={{ remember: true }}
      onFinish={handleAddCase}
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
            label="提交人"
            name="submitUser"
            initialValue={realName}
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="委托事项"
            name="matterItem"
            rules={[{ required: true, message: "请选择委托事项" }]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="选择类别"
              allowClear
              onChange={setCommissionMatters}
              value={commissionMatters}
              options={[
                { value: MatterItemType.judicial, label: "司法鉴定" },
                { value: MatterItemType.decryption, label: "破译解密" }
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
            <AutoComplete
              onSelect={handleMatterNoSelect}
              onSearch={handleMatterNoChange}
              placeholder="请输入检案编号"
              options={autocompleteOptions}
            />
            {/* <Input placeholder="请输入检案编号" onChange={(e) => handleMatterNoChange(e.target.value)}/> */}
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="委托日期"
            name="matterDate"
            rules={[{ required: true, message: "请输入委托日期" }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="请输入委托日期"
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
      </Row>

      {whichForm}

      <Form.Item>
        <Space style={{ display: "flex", justifyContent: "right" }}>
          <Button type="primary" htmlType="submit">提交并继续录入下一条</Button>
          <Button onClick={handleCancle}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
