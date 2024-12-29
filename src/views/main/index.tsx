import { useSelector, useDispatch } from "react-redux"
import numStatus from "@/store/NumStatus"
import { Card, Col, DatePicker, Flex, Input, Row, Select, Space, Statistic, Typography } from "antd";
import BarChart from "@/components/BarChart";
import LineChart from "@/components/LineChart";
import PieChart from "@/components/PieChart";
import { BankFilled, FileOutlined, LockOutlined } from "@ant-design/icons";
const View = () => {
  const dispatch = useDispatch();

  // 对num的操作
  // 通过useSelector获取仓库数据
  const { num, sarr } = useSelector((state: RootState) => ({
    num: state.handleNum.num,
    sarr: state.handleArr.sarr
  }))
  // 通过useDispatch修改仓库数据
  const changeNum = () => {
    // dispatch({type:"字符串(认为是一个记号)",val:3})   type是固定的  val是自定义的
    // dispatch({type:"add1"})
    dispatch({ type: "add3", val: 100 })   // 触发了reducer函数的执行
  }
  const changeNum2 = () => {
    // 最开始的写法-同步的写法
    // dispatch({type:"add1"})  

    // 异步的写法- redux-thunk的用法  基本格式：  dispatch(异步执行的函数)
    // dispatch((dis:Function)=>{
    //   setTimeout(()=>{
    //     dis({type:"add1"})
    //   },1000)
    // })

    // 优化redux-thunk的异步写法  `
    // dispatch(调用状态管理中的asyncAdd1)
    dispatch(numStatus.asyncActions.asyncAdd1)
  }
  // 对sarr的操作
  // const {sarr} = useSelector((state:RootState)=>({
  //   sarr:state.handleArr.sarr
  // }));

  const changeArr = () => {
    dispatch({ type: "sarrpush", val: 100 })
  }

  // 顶部卡片数据
  const cardData = [
    {
      title: '总编号案件数量',
      value: 1263,
      icon: <FileOutlined style={{ fontSize: 24 }} />,
      color: '#E8F3EE'
    },
    {
      title: '司法鉴定总数量',
      value: 5623,
      icon: <BankFilled style={{ fontSize: 24 }} />,
      color: '#F0EDF9'
    },
    {
      title: '破译解密总数量',
      value: 1893,
      icon: <LockOutlined style={{ fontSize: 24 }} />,
      color: '#EDF2F9'
    },
  ];
  return (
    <Row gutter={16}>
      <Col span={18} >

        {/* 顶部统计卡片 */}
        <Row gutter={16}>
          {cardData.map(item => (
            <Col span={8} key={item.title}>
              <Card
                style={{
                  background: item.color,
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}
              >
                <Space align="center">
                  {item.icon}
                  <Statistic title={item.title} value={item.value} />
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
        {/* 司法鉴定部分 */}
        <Card
          title="司法鉴定"
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical >
                  <Flex justify="space-between" >
                    <Select
                      style={{
                        width: "33%",
                      }}
                      placeholder={"选择类别"}
                      allowClear
                      // onChange={(value) => setCommissionMatters(value)}
                      // value={commissionMatters}
                      // defaultValue={commissionMatters}
                      options={[
                        {
                          value: "司法鉴定",
                          label: "司法鉴定",
                        },
                        {
                          value: "破译解密",
                          label: "破译解密",
                        }
                      ]}
                    />
                    <DatePicker.RangePicker />
                  </Flex>
                  <LineChart />
                </Flex>
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical >
                  <Input.Search
                    placeholder="关键词a/关键词b/......"
                  />
                  <BarChart />
                </Flex>
              </Card>
            </Col>
          </Row>
        </Card>
        {/* 破译解密部分 */}
        <Card title="破译解密">
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical>
                  <Flex justify="space-between" >
                    <Select
                      style={{
                        width: "33%",
                      }}
                      placeholder={"选择类别"}
                      allowClear
                      // onChange={(value) => setCommissionMatters(value)}
                      // value={commissionMatters}
                      // defaultValue={commissionMatters}
                      options={[
                        {
                          value: "司法鉴定",
                          label: "司法鉴定",
                        },
                        {
                          value: "破译解密",
                          label: "破译解密",
                        }
                      ]}
                    />
                    <DatePicker.RangePicker />
                  </Flex>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Typography.Title level={5}>{`已破解：${12}`}</Typography.Title>
                    </Col>
                    <Col span={12}>
                      <Typography.Title level={5}>{`未破解：${56}`}</Typography.Title>
                    </Col>
                  </Row>
                  <PieChart />
                </Flex>
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical>
                  <Input.Search
                    placeholder="关键词a/关键词b/......"
                  />
                  <BarChart />
                </Flex>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={6}>

        <Flex vertical justify="space-between" style={{ height: '100%' }}>
          <Card title={<Input.Search
            placeholder="请输入检材编号"
          />}>
            <PieChart />
            <Space direction="vertical">


              <Typography.Title level={5}>司法鉴定</Typography.Title>

              <Typography.Text type="secondary" strong>{`检材总数：${1263}`}</Typography.Text>
              <Typography.Text type="secondary" strong>{`检材总容量：${1263}`}</Typography.Text>

              <Typography.Title level={5}>破译解密</Typography.Title>
              <Typography.Text type="secondary" strong>{`检材总数：${1263}`}</Typography.Text>
              <Typography.Text type="secondary" strong>{`检材总容量：${1263}`}</Typography.Text>
            </Space>
          </Card>
          <Card title={<Input.Search
            placeholder="请输入敌情方向"
          />}>
            <BarChart />
          </Card>
        </Flex>
      </Col>
    </Row>
  )
}

export default View