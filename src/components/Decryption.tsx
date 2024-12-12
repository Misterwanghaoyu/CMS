// 破译解密
import React ,{useState}from 'react'
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Radio,
  Table,
  Select,
  Space,
  ConfigProvider,
  DatePicker,
} from "antd";
export default function  Decryption() {
  const [isCraking,setIsCraking]=useState(true)
  return (
    <>
    <Form.Item
        label="敌情方向"
        name="enemy_direction"
        rules={[{ required: true, message: "请输入敌情方向" }]}
      >
        <Input placeholder="请输入敌情方向" />
      </Form.Item>
      <Form.Item
        label="来源"
        name="origin"
        rules={[{ required: true, message: "请输入来源" }]}
      >
        <Input placeholder="请输入来源" />
      </Form.Item>
      <Form.Item
        label="加密类型"
        name="encryption_type"
        rules={[{ required: true, message: "请输入加密类型" }]}
      >
        <Input placeholder="请输入加密类型" />
      </Form.Item>
      <Form.Item
        label="文件名"
        name="file_name"
        rules={[{ required: true, message: "请输入文件名" }]}
      >
        <Input placeholder="请输入文件名" />
      </Form.Item>

      <Form.Item
        label="是否破解"
        name="is_cracking"
        rules={[{ required: true, message: "是否破解？" }]}
      >
        <Select
          style={{
            width: 120,
          }}
          placeholder={"是否破解"}
          allowClear
          value={isCraking}
          onChange={(value) => setIsCraking(value)}
          options={[
            {
              value: true,
              label: "是",
            },
            {
              value: false,
              label: "否",
            }
          ]}
        />
      </Form.Item>
      {isCraking && <Form.Item
        label="明文密码"
        name="plain_password"
        rules={[{ required: true, message: "请输入明文密码" }]}
      >
        <Input placeholder="请输入明文密码" />
      </Form.Item>}
      
      <Form.Item
        label="绩效反馈"
        name="performance_feedback"
        rules={[{ required: true, message: "请输入绩效反馈" }]}
      >
        <Input.TextArea
          placeholder="请输入绩效反馈"
          autoSize={{
            minRows: 4,
            maxRows: 6,
          }}
        />
      </Form.Item>
      <Form.Item
        label="备注"
        name="tips"
        rules={[{ required: false, message: "请输入备注" }]}
      >
        <Input.TextArea
          placeholder="请输入备注"
          autoSize={{
            minRows: 4,
            maxRows: 6,
          }}
        />
      </Form.Item>
    </>
  )
 
}