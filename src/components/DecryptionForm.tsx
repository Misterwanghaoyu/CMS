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
export default function DecryptionForm({ form }: { form? : FormInstance }) {
  const [isCraking, setIsCraking] = useState("1")

  useEffect(() => {
    if (isCraking === "2") {
      form?.setFieldValue("plaintextPassword", "");
    }
  }, [isCraking])

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
            initialValue={isCraking}
            name="cracked"
            rules={[{ required: true, message: "是否破解？" }]}
          >
            <Radio.Group onChange={(e) => setIsCraking(e.target.value)} value={isCraking}>
              <Radio value="1">是</Radio>
              <Radio value="2">否</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="明文密码"
            initialValue={""}
            hidden={isCraking === "2" ? true : false}
            name="plaintextPassword"
            rules={[{ required: isCraking === "1" ? true : false, message: "请输入明文密码" }]}
          >
            <Input placeholder="请输入明文密码" />
          </Form.Item>
        </Col>
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