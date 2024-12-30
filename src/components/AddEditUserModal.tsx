import { userApi } from '@/request/api'
import { Modal, Input, Select, Space, Button, Form, message, FormInstance, App } from 'antd'

interface PropsType {
  selectedRowItem: UserDataType | null
  isModalOpen: boolean
  isUpdate: boolean
  form: FormInstance<UserDataType>
  setIsModalOpen: Function,
  reFetch: Function
}
const AddEditUserModal: React.FC<PropsType> = ({selectedRowItem, isModalOpen, isUpdate, form, setIsModalOpen, reFetch }) => {
  const { notification } = App.useApp();

  const handleAddUpdateUser = async (formData:UserDataType) => {
    if (isUpdate && selectedRowItem) {
      formData.userId=selectedRowItem.userId
      userApi.updateUser(formData).then(
        res => {
          if(res.code===0){
            notification.success({
              message: "成功",
              description: "修改成功"
            })
            form.resetFields()
            setIsModalOpen(false)
            reFetch()
          }else{
            notification.error({
              message: "错误",
              description: res.message
            })
          }
        },
        rej => {
          notification.error({
            message: "错误",
            description: "something wrong,request rejcted."
          })
        }
      ).catch(err => {
        notification.error({
          message: "错误",
          description: err.message
        })
      }
      )
    } else {
      userApi.addUser(formData).then(
        res => {
          if (res.code === 0) {
            notification.success({
              message: "成功",
              description: "数据新增成功"
            })
            form.resetFields()
            setIsModalOpen(false)
            reFetch()
          } else {
            notification.error({
              message: "错误",
              description: res.message
            })
          }
        },
        rej => {
          notification.error({
            message: "错误",
            description: "something wrong,request rejcted."
          })
        }
      ).catch(err => {
        notification.error({
          message: "错误",
          description: err.message
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
        onFinish={(formData)=>handleAddUpdateUser(formData)}
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
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" },{ len: 6, message: "请输入至少6位密码" }]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          label="权限"
          name="role"
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
                value: "1",
                label: "管理员",
              },
              {
                value: "2",
                label: "普通用户",
              }
            ]}
          />
        </Form.Item>


        <Form.Item
          label="联系方式"
          name="mobile"
        >
          <Input placeholder="请输入联系方式" />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="姓名"
          name="realName"
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          label="性别"
          name="sex"
        >
          <Select
            style={{
              width: "100%",
            }}
            placeholder={"请选择性别"}
            allowClear
            options={[
              {
                value: "1",
                label: "男",
              },
              {
                value: "2",
                label: "女",
              }
            ]}
          />
        </Form.Item>
        <Form.Item
          label="备注"
          name="remark"
        >
          <Input.TextArea placeholder="请输入备注" />
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