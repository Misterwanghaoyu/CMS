// 破译解密
import { useEffect, useState } from 'react'
import {
  Col,
  Form,
  FormInstance,
  Input,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
import { CrackedType } from '@/utils/enum';
export default function DecryptionForm({ crack, form }: { crack?: CrackedType, form? : FormInstance }) {
  const [cracked, setCracked] = useState<CrackedType>(crack || CrackedType.yes)
  useEffect(() => {
    // 当破解状态改变时,如果是未破解则清空明文密码字段
    if (cracked === CrackedType.no) {
      form?.setFieldValue('plaintextPassword', undefined);
    }
  }, [cracked, form]);
  
  return (
    <>
      <Typography.Title level={5} style={{ margin: "0 0 10px 0" }}>具体信息</Typography.Title>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="敌情方向"
            name="direction"
            rules={[{ required: true, message: "请输入敌情方向" }]}
          >
            <Input placeholder="请输入敌情方向" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="来源"
            name="source"
            rules={[{ required: true, message: "请输入来源" }]}
          >
            <Input placeholder="请输入来源" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="加密类型"
            name="encryptionType"
            rules={[{ required: true, message: "请输入加密类型" }]}
          >
            <Input placeholder="请输入加密类型" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="文件名"
            name="fileName"
            rules={[{ required: true, message: "请输入文件名" }]}
          >
            <Input placeholder="请输入文件名" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="是否破解"
            name="cracked"
            rules={[{ required: true, message: "是否破解？" }]}
          >
            <Radio.Group onChange={(e) => setCracked(e.target.value)} value={cracked}>
              <Radio value={CrackedType.yes}>是</Radio>
              <Radio value={CrackedType.no}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {cracked === CrackedType.yes && (
          <Col span={10}>
            <Form.Item
              label="明文密码"
              name="plaintextPassword"
              rules={[{ required: true, message: "请输入明文密码" }]}
            >
              <Input placeholder="请输入明文密码" />
            </Form.Item>
          </Col>
        )}
      </Row>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="绩效反馈"
            name="feedback"
          >
            <Input.TextArea
              placeholder="请输入绩效反馈"
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea
              placeholder="请输入备注"
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )

}