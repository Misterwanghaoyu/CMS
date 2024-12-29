// 破译解密
import { useEffect, useState } from 'react'
import {
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Typography,
} from "antd";
export default function DecryptionForm({ isCrakingProp }: { isCrakingProp: boolean }) {
  const [isCraking, setIsCraking] = useState(isCrakingProp)
  useEffect(() => {
    setIsCraking(isCrakingProp)
  }, [isCrakingProp])
  return (
    <>
      <Typography.Title level={5} style={{ margin: "0 0 10px 0" }}>具体信息</Typography.Title>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="敌情方向"
            name="enemy_direction"
            rules={[{ required: true, message: "请输入敌情方向" }]}
          >
            <Input placeholder="请输入敌情方向" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="来源"
            name="origin"
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
            name="encryption_type"
            rules={[{ required: true, message: "请输入加密类型" }]}
          >
            <Input placeholder="请输入加密类型" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="文件名"
            name="file_name"
            rules={[{ required: true, message: "请输入文件名" }]}
          >
            <Input placeholder="请输入文件名" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16} justify="space-between">
        <Col span={10}>

        </Col>
        <Col span={10}>
          <Form.Item
            label="是否破解"
            name="is_cracking"
            rules={[{ required: true, message: "是否破解？" }]}
          >
            <Radio.Group onChange={(e) => setIsCraking(e.target.value)} value={isCraking}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
          {isCraking && <Form.Item
            // label="明文密码"
            name="plain_password"
            rules={[{ required: true, message: "请输入明文密码" }]}
          >
            <Input placeholder="请输入明文密码" />
          </Form.Item>}
        </Col>
      </Row>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="绩效反馈"
            name="performance_feedback"
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
            name="tips"
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