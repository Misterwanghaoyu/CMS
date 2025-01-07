// import { useSelector, useDispatch } from "react-redux"
// import numStatus from "@/store/NumStatus"
import { App, Card, Col, DatePicker, Flex, Input, Row, Space, Statistic, Typography } from "antd";
import BarChart from "@/components/BarChart";
import LineChart from "@/components/LineChart";
import PieChart from "@/components/PieChart";
import { BankFilled, FileOutlined, LockOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { mainApi } from "@/request/api";
import type { GetProp, TimeRangePickerProps } from 'antd';

type RangePickerType = GetProp<TimeRangePickerProps, 'value'>;

const View = () => {
  const { notification } = App.useApp()
  // const dispatch = useDispatch();

  // 对num的操作
  // 通过useSelector获取仓库数据
  // const { num, sarr } = useSelector((state: RootState) => ({
  //   num: state.handleNum.num,
  //   sarr: state.handleArr.sarr
  // }))
  // // 通过useDispatch修改仓库数据
  // const changeNum = () => {
  //   // dispatch({type:"字符串(认为是一个记号)",val:3})   type是固定的  val是自定义的
  //   // dispatch({type:"add1"})
  //   dispatch({ type: "add3", val: 100 })   // 触发了reducer函数的执行
  // }
  // const changeNum2 = () => {
  //   // 最开始的写法-同步的写法
  //   // dispatch({type:"add1"})  

  //   // 异步的写法- redux-thunk的用法  基本格式：  dispatch(异步执行的函数)
  //   // dispatch((dis:Function)=>{
  //   //   setTimeout(()=>{
  //   //     dis({type:"add1"})
  //   //   },1000)
  //   // })

  //   // 优化redux-thunk的异步写法  `
  //   // dispatch(调用状态管理中的asyncAdd1)
  //   dispatch(numStatus.asyncActions.asyncAdd1)
  // }
  // 对sarr的操作
  // const {sarr} = useSelector((state:RootState)=>({
  //   sarr:state.handleArr.sarr
  // }));

  // const changeArr = () => {
  //   dispatch({ type: "sarrpush", val: 100 })
  // }

  const [totalData, setTotalData] = useState([
    {
      title: '总案件数量',
      value: 0,
      icon: <FileOutlined style={{ fontSize: 24 }} />,
      color: '#E8F3EE'
    },
    {
      title: '司法鉴定总数量',
      value: 0,
      icon: <BankFilled style={{ fontSize: 24 }} />,
      color: '#F0EDF9'
    },
    {
      title: '破译解密总数量',
      value: 0,
      icon: <LockOutlined style={{ fontSize: 24 }} />,
      color: '#EDF2F9'
    },
  ]);

  const [sampleData, setSampleData] = useState({ date: [], total: [], totalCapacity: [] });
  const [crackedDataByDate, setCrackedDataByDate] = useState<{ value: number, name: string }[]>([]);
  const [totalDataRange, setTotalDataRange] = useState<RangePickerType | null>(null);
  const [sampleDataRange, setSampleDataRange] = useState<RangePickerType | null>(null);
  const [crackedDataRange, setCrackedDataRange] = useState<RangePickerType | null>(null);
  const [searchValueOneData, setSearchValueOneData] = useState({ keywords: [], total: [] });
  const [searchValueTwoData, setSearchValueTwoData] = useState({ keywords: [], total: [] });
  const [searchDataById, setSearchDataById] = useState({
    pieData: [],
    sampleCount: 0,
    sampleCapacity: 0,
    crackedCount: 0,
    notCrackedCount: 0,
  });

  // const [searchValueThreeData, setSearchValueThreeData] = useState({ keywords: [], total: [] })

  const fetchTotalData = async (beginDate = '', endDate = '') => {
    const res = await mainApi.getTotalData(`beginDate=${beginDate}&endDate=${endDate}`)
    const newTotalData = totalData.map((item, index) => ({
      ...item,
      value: res[index]
    }));
    setTotalData(newTotalData);
  };

  const fetchSampleData = async (beginDate = '', endDate = '') => {
    const res = await mainApi.getSampleData(`beginDate=${beginDate}&endDate=${endDate}`);
    setSampleData(res);
  };

  const fetchCrackedData = async (beginDate = '', endDate = '') => {
    const res = await mainApi.getCrackedData(`beginDate=${beginDate}&endDate=${endDate}`);
    setCrackedDataByDate(res);
  };

  const handleSearch = async (value = '', type: 1 | 2) => {
    const res = await mainApi.getDirectionDataByDirection(`direction=${value}&matterItem=${type}`);
    type === 1 ? setSearchValueOneData(res) : setSearchValueTwoData(res);
  };

  const handleSearchById = async (value = '') => {
    const res = await mainApi.getCombinationDataById(`matterNo=${value}`);
    setSearchDataById(res);
  };

  useEffect(() => {
    const beginDate = totalDataRange?.[0]?.format("YYYY-MM-DD HH:mm:ss") || '';
    const endDate = totalDataRange?.[1]?.format("YYYY-MM-DD HH:mm:ss") || '';
    fetchTotalData(beginDate, endDate);
  }, [totalDataRange]);

  useEffect(() => {
    const beginDate = sampleDataRange?.[0]?.format("YYYY-MM-DD HH:mm:ss") || '';
    const endDate = sampleDataRange?.[1]?.format("YYYY-MM-DD HH:mm:ss") || '';
    fetchSampleData(beginDate, endDate);
  }, [sampleDataRange]);

  useEffect(() => {
    const beginDate = crackedDataRange?.[0]?.format("YYYY-MM-DD HH:mm:ss") || '';
    const endDate = crackedDataRange?.[1]?.format("YYYY-MM-DD HH:mm:ss") || '';
    fetchCrackedData(beginDate, endDate);
  }, [crackedDataRange]);

  useEffect(() => {
    handleSearch('', 1);
    handleSearch('', 2);
    handleSearchById();
  }, []);

  return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card title={<DatePicker.RangePicker value={totalDataRange} onChange={setTotalDataRange} />}>
          <Row gutter={16}>
            {totalData.map(item => (
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
        </Card>

        <Card title="司法鉴定">
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical>
                  <DatePicker.RangePicker value={sampleDataRange} onChange={setSampleDataRange} />
                  <LineChart data={sampleData} />
                </Flex>
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical>
                  <Input.Search
                    defaultValue=""
                    onSearch={(value) => handleSearch(value, 1)}
                    placeholder="请输入敌情方向"
                  />
                  <BarChart data={searchValueOneData} />
                </Flex>
              </Card>
            </Col>
          </Row>
        </Card>

        <Card title="破译解密">
          <Row gutter={16}>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical>
                  <DatePicker.RangePicker value={crackedDataRange} onChange={setCrackedDataRange} />
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Typography.Title level={5}>{`已破解：${crackedDataByDate[0]?.value || 0}`}</Typography.Title>
                    </Col>
                    <Col span={12}>
                      <Typography.Title level={5}>{`未破解：${crackedDataByDate[1]?.value || 0}`}</Typography.Title>
                    </Col>
                  </Row>
                  <PieChart name="破解情况" data={crackedDataByDate} />
                </Flex>
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Flex vertical>
                  <Input.Search
                    defaultValue=""
                    onSearch={(value) => handleSearch(value, 2)}
                    placeholder="请输入敌情方向"
                  />
                  <BarChart data={searchValueTwoData} />
                </Flex>
              </Card>
            </Col>
          </Row>
        </Card>
      </Space>

      // <Col span={6}>
      //   <Flex vertical justify="space-between" style={{ height: '100%' }}>
      //     <Card title={
      //       <Input.Search
      //         placeholder="请输入检案编号"
      //         onSearch={handleSearchById}
      //       />
      //     }>
      //       <PieChart name="案件情况" data={searchDataById.pieData} />
      //       <Space direction="vertical">
      //         <Typography.Title level={5}>司法鉴定</Typography.Title>
      //         <Typography.Text type="secondary" strong>{`检材总数：${searchDataById.sampleCount}`}</Typography.Text>
      //         <Typography.Text type="secondary" strong>{`检材总容量：${searchDataById.sampleCapacity}`}</Typography.Text>
      //         <Typography.Title level={5}>破译解密</Typography.Title>
      //         <Typography.Text type="secondary" strong>{`已破解：${searchDataById.crackedCount}`}</Typography.Text>
      //         <Typography.Text type="secondary" strong>{`未破解：${searchDataById.notCrackedCount}`}</Typography.Text>
      //       </Space>
      //     </Card>
      //   </Flex>
      // </Col>
  );
};

export default View;