import { addUser, updateUser } from '@/request/api'
import { Modal, Input, Select, Space, Button, Form, message, FormInstance, App } from 'antd'

interface PropsType {
  isModalOpen: boolean
  isUpdate: boolean
  form: FormInstance<any>
  setIsModalOpen: Function
}
const AddEditUserModal: React.FC<PropsType> = ({ isModalOpen, isUpdate, form, setIsModalOpen }) => {
  const { message, notification } = App.useApp();

  const handleAddUpdateUser = async (formData: any) => {
    // const { data } = await blogApi.saveBlog(blogForm);

    if (isUpdate) {
      updateUser(formData).then(
        res => {
          notification.success({
            message:"成功",
            description:"数据更新成功"
          })
          form.resetFields()
          setIsModalOpen(false)
        },
        rej => {
          notification.error({
            message:"错误",
            description:"something wrong,request rejcted."
          })
        }
      ).catch(err => {
        notification.error({
          message:"错误",
          description:err.message
        })
      }
      )
    } else {
      addUser(formData).then(
        res => {
          notification.success({
            message:"成功",
            description:"数据新增成功"
          })
          form.resetFields()
          setIsModalOpen(false)
        },
        rej => {
          notification.error({
            message:"错误",
            description:"something wrong,request rejcted."
          })
        }
      ).catch(err => {
        notification.error({
          message:"错误",
          description:err.message
        })
      }
      )
    }
  };
  return (
    <Modal
      title={isUpdate ? "编辑用户" : "新增用户"}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[]}
    >
      <Form
        form={form}
        style={{ maxWidth: 400 }}
        initialValues={{ remember: true }}
        onFinish={handleAddUpdateUser}
        autoComplete="off"
      >

        <Form.Item
          label="账号"
          name="username"
          rules={[{ required: true, message: "请输入账号" }]}
        >
          <Input placeholder="请输入账号" />
        </Form.Item>
        <Form.Item
          label="联系方式"
          name="contact_way"
          rules={[{ required: true, message: "请输入联系方式" }]}
        >
          <Input placeholder="请输入联系方式" />
        </Form.Item>
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: "请输入姓名" }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          label="权限"
          name="permission"
          rules={[{ required: true, message: "请选择权限" }]}
        >
          <Select
            style={{
              width: "100%",
            }}
            placeholder={"请选择权限"}
            allowClear
            options={[
              {
                value: "admin",
                label: "管理员",
              },
              {
                value: "user",
                label: "普通用户",
              }
            ]}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            <Button onClick={() => form.resetFields()}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default AddEditUserModal