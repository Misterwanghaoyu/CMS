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
// import zhCN from "antd/locale/zh_CN";
import { useEffect, useMemo, useState } from "react";
// 处理时间的js工具
import moment from "moment";
// 导入APi
// import blogApi from "../../api/BlogApi";
import Decryption from "@/components/Decryption";
import ForensicIdentificationForm from "@/components/ForensicIdentificationForm";
const Blog = () => {
  const { TextArea } = Input;
  const [commissionMatters, setCommissionMatters] = useState()
  // 表格参数的控制
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      width: 100,
      render: (_, record, index) => (index + 1).toString(),
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "类别",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      width: 400,
    },
    {
      title: "创建时间",
      key: "createTime",
      render: (record) => moment(record.createTime).format("YYYY-MM-DD"),
    },
    {
      title: "操作",
      key: "action",
      render: (row) => (
        <span>
          <Button
            style={{
              backgroundColor: "orange",
              color: "white",
              marginRight: "5px",
            }}
            onClick={() => handleOpenUpdateModal(row)}
          >
            编辑
          </Button>
          <Popover
            title="您确定要删除该案件吗？"
            content={
              <Button
                onClick={() => handleDeleteBlog(row.id)}
                type="primary"
                danger
              >
                确定
              </Button>
            }
          >
            <Button type="primary" danger>
              删除
            </Button>
          </Popover>
        </span>
      ),
    },
  ];
  // 查询参数
  const [params, setParams] = useState({
    current: 1,
    size: 10,
    type: "",
    title: "",
  });
  // 博客列表数据
  const [blogList, setBlogList] = useState([]);
  // 博客总数
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getBlogList();
  }, [params]); //监听搜索参数的变化，如果变化了，就重新获取数据
  // 获取博客数据
  const getBlogList = async () => {
    // const { data } = await blogApi.getBlogList(params);
    // 博客总数
    // setTotal(data.data.total);
    // 博客列表数据
    // setBlogList(data.data.records);
  };
  // 切换每页页码、跳转页码
  const handlePaginationChange = (newPageNum, newPageSize) => {
    setParams({
      ...params,
      current: newPageNum,
      size: newPageSize,
    });
  };
  // 判断是否更新
  const [isUpdate, setIsUpdate] = useState(false);
  // 模态框打开
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 打开模态框
  const handleOpenUpdateModal = (row) => {
    //将当前行的数据赋值给表单
    form.setFieldsValue(row);
    setIsUpdate(true);
    setIsModalOpen(true);
  };
  // 删除博客
  const handleDeleteBlog = async (id) => {
    // await blogApi.delBlog(id);
    message.success("删除成功");
    getBlogList();
  };
  // 新增博客 form
  const [form] = Form.useForm();
  // 打开新增和编辑博客的模态框
  const handleOpenAddModal = () => {
    form.resetFields(); //每次打开新增窗口时都要清空数据
    setIsUpdate(false);
    setIsModalOpen(true);
  };
  // 展示总条数
  const showTotal = (total) => {
    return `共 ${total} 条`;
  };
  // 新增和编辑博客
  const handleAddUpdateBlog = async (blogForm) => {
    // const { data } = await blogApi.saveBlog(blogForm);
    console.log(blogForm);

    // if (data.code == 200) {
    //   form.resetFields();
    //   setIsModalOpen(false);
    //   getBlogList();
    // } else {
    //   message.error(data.message);
    // }
  };
  const whichForm = useMemo(() => {
    console.log(commissionMatters);
    
    if (commissionMatters === "forensic_identification") return <ForensicIdentificationForm />
    else if (commissionMatters ==="decryption") return <Decryption />
    else return <></>
  }, [commissionMatters])

  return (
    <div>
      {/* 操作栏 */}
      <Space style={{ marginBottom: "10px" }}>
        <label>
          {"选择类别："}
          <Select
            style={{
              width: 120,
            }}
            placeholder={"选择类别"}
            allowClear
            onChange={(value) => setParams({ ...params, type: value })}
            options={[
              {
                value: "vue",
                label: "vue",
              },
              {
                value: "java",
                label: "java",
              },
              {
                value: "uniapp",
                label: "uniapp",
              },
              {
                value: "react",
                label: "react",
              },
              {
                value: "js",
                label: "js",
              },
            ]}
          />
        </label>
        <Input.Search
          value={params.title}
          onChange={(e) => setParams({ ...params, title: e.target.value })}
          style={{ width: "200px" }}
          allowClear
          placeholder="请输入标题"
          enterButton
        />
        <Button type="primary" onClick={handleOpenAddModal}>
          新增案件
        </Button>
      </Space>
      {/* <ConfigProvider locale={zhCN}> */}
        <Table
          rowKey={(record) => record.id}
          bordered={true}
          pagination={{
            current: params.current,
            pageSize: params.size,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: showTotal,
            onChange: handlePaginationChange,
          }}
          columns={columns}
          dataSource={blogList}
          scroll={{ y: 540 }}
        />
      {/* </ConfigProvider> */}
      {/* 新增编辑博客 */}
      <Modal
        title={isUpdate ? "编辑案件" : "新增案件"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[]}
      >
        <Form
          form={form}
          style={{ maxWidth: 400 }}
          initialValues={{ remember: true }}
          onFinish={handleAddUpdateBlog}
          autoComplete="off"
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="检案编号"
            name="case_number"
            rules={[{ required: true, message: "请输入检案编号" }]}
          >
            <Input placeholder="请输入检案编号" />
          </Form.Item>
          <Form.Item
            label="委托日期"
            name="commission_date"
            rules={[{ required: true, message: "请输入委托日期" }]}
          >
            <DatePicker placeholder="请输入委托日期" />
          </Form.Item>
          <Form.Item
            label="委托单位"
            name="commission_unit"
            rules={[{ required: true, message: "请输入委托单位" }]}
          >
            <Input placeholder="请输入委托单位" />
          </Form.Item>
          <Form.Item
            label="委托事项"
            name="commission_matters"
          rules={[{ required: true, message: "请选择委托事项" }]}
          >
            <Select
              style={{
                width: 120,
              }}
              placeholder={"选择类别"}
              allowClear
              onChange={(value) => setCommissionMatters(value)}
              value={commissionMatters}
              defaultValue={commissionMatters}
              options={[
                {
                  value: "forensic_identification",
                  label: "司法鉴定",
                },
                {
                  value: "decryption",
                  label: "破译解密",
                }
              ]}
            />
          </Form.Item>
          {whichForm}


          {/* <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入内容" }]}
          >
            <TextArea
              placeholder="请输入内容"
              autoSize={{
                minRows: 4,
                maxRows: 6,
              }}
            />
          </Form.Item> */}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button htmlType="submit" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Blog;
