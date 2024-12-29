// 司法鉴定
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
export default function JudicialIdentificationForm() {
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
            label="对象姓名"
            name="subject_name"
            rules={[{ required: true, message: "请输入对象姓名" }]}
          >
            <Input placeholder="请输入对象姓名" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="证据类型"
            name="id_type"
            rules={[{ required: true, message: "请输入证据类型" }]}
          >
            <Select
              style={{
                width: "100%",
              }}
              placeholder={"选择类别"}
              allowClear
              options={[
                {
                  value: "id_card",
                  label: "身份证",
                },
                {
                  value: "passport",
                  label: "护照",
                }
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="证件号码"
            name="id_number"
            rules={[{ required: true, message: "请输入证件号码" }]}
          >
            <Input placeholder="请输入证件号码" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="检材数量"
            name="samples_number"
            rules={[{ required: true, message: "请输入检材数量" }]}
          >
            <Input type='number' placeholder="请输入检材数量" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="检材容量（单位：MB/GB）"
            name="samples_capacity"
            rules={[{ required: true, message: "请输入检材容量" }]}
          >
            <Input type='number' placeholder="请输入检材容量" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="案情简介"
            name="case_brief"
          >
            <Input.TextArea
              placeholder="请输入案情简介"
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            label="工作内容"
            name="work_content"
          >
            <Input.TextArea
              placeholder="请输入工作内容"
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} justify="space-between">
        <Col span={10}>
          <Form.Item
            label="工作成果"
            name="work_results"
          >
            <Input.TextArea
              placeholder="请输入工作成果"
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


