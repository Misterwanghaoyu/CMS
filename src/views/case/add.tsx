import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { caseApi } from '@/request/api';
import { MatterItemType } from '@/utils/enum';
import { downLoadFile } from '@/utils/Functions';
import { useCallback, useMemo, useState } from 'react'
import DecryptionForm from '@/components/DecryptionForm';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import JudicialIdentificationForm from '@/components/JudicialIdentificationForm';
import { Space, Button, Row, Col, Input, Select, DatePicker, Form, Typography, Flex, App, AutoComplete, AutoCompleteProps, Upload, UploadProps, Popover } from 'antd';

export default function DataAddPage() {
  const [form] = Form.useForm();
  const { notification } = App.useApp();
  const { username } = JSON.parse(localStorage.getItem("userInfo")!)
  const [commissionMatters, setCommissionMatters] = useState<MatterItemType>()
  const [commissionMattersDisabled, setCommissionMattersDisabled] = useState(false)
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutoCompleteProps['options']>([]);

  const handleCancle = () => {
    setCommissionMatters(undefined)
    form.resetFields()
  }

  const handleImportSuccess = (message: string) => {
    notification.success({
      message: '成功',
      description: message
    })
  }

  const handleImportError = (error: any) => {
    notification.error({
      message: '错误',
      description: error.message || '导入失败'
    })
  }

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

  const handleMatterNoSelect = async (value: string) => {
    const res = await caseApi.getByMatterNo(`matterNo=${value}`);
    const { matterUnit, matterItem, matterDate } = res[0];
    setCommissionMattersDisabled(true)
    setCommissionMatters(matterItem)
    form.setFieldsValue({
      matterUnit,
      matterItem,
      matterDate: dayjs(matterDate)
    });

  }
  const handleExportTemplate = async (matterItem: number) => {
    const res = await caseApi.exportMatterTemplate(`matterItem=${matterItem}`, { responseType: 'blob' })
    downLoadFile(res)
    notification.success({
      message: '成功',
      description: '模板已导出'
    });
  }
  const getUploadProps = (matterItem: number): UploadProps => ({
    name: 'file',
    action: `${import.meta.env.VITE_APP_BASEAPI}/api/file/importMatter`,
    headers: {
      authorization: localStorage.getItem('token') || ''
    },
    accept: '.xlsx, .xls',
    data: {
      matterItem
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 0) handleImportSuccess(info.file.response.message)
        else handleImportError(info.file.response)
      } else if (info.file.status === 'error') {
        handleImportError(info.file.response)
      } else if (info.file.status === 'removed') {
      }
    },
  });
  const whichForm = useMemo(() => {
    if (commissionMatters === MatterItemType.judicial) return <JudicialIdentificationForm />
    if (commissionMatters === MatterItemType.decryption) return <DecryptionForm form={form} />
    return <></>
  }, [commissionMatters])
  const handleMatterNoChange = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        form.resetFields();
        setCommissionMatters(undefined)
        setCommissionMattersDisabled(false)
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
        setCommissionMattersDisabled(false)
        return;
      }

      setAutocompleteOptions(res.map((item: any) => ({
        label: item.matterNo,
        value: item.matterNo,
      })));
    }, 1000),
    [form]
  );
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

        <Space>
          <Popover content={
            <Space direction='vertical'>
              <Button icon={<DownloadOutlined />} onClick={() => handleExportTemplate(1)}>导出司法鉴定模板</Button>
              <Button icon={<DownloadOutlined />} onClick={() => handleExportTemplate(2)}>导出破译解密模板</Button>
            </Space>
          } trigger="hover">
            <Button>导出模板</Button>
          </Popover>
          <Popover content={
            <Space direction='vertical'>
              <Upload {...getUploadProps(1)}>
                <Button icon={<UploadOutlined />}>导入司法鉴定（Excel）</Button>
              </Upload>
              <Upload {...getUploadProps(2)}>
                <Button icon={<UploadOutlined />}>导入破译解密（Excel）</Button>
              </Upload>
            </Space>
          } trigger="hover">
            <Button>导入文件</Button>
          </Popover>
        </Space>
      </Flex>

      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="提交人"
            name="submitUser"
            initialValue={username}
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
              disabled={commissionMattersDisabled}
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
            <Input placeholder="请输入委托单位" disabled={commissionMattersDisabled} />
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
              disabled={commissionMattersDisabled}
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
