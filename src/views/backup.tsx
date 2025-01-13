const week = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
import { useEffect, useMemo, useState } from 'react';
import { TimePicker, Select, Button, Typography, Row, Col, App, Space, Input, Card, Flex, Popover } from 'antd';
import { backupApi } from '@/request/api';
import dayjs from 'dayjs';
const Backup = () => {
    const { notification } = App.useApp()
    const [backupType, setBackupType] = useState('daily'); // 新增状态来选择备份类型
    const [dailyTime, setDailyTime] = useState<dayjs.Dayjs | null>(null);
    const [weeklyDate, setWeeklyDate] = useState();
    const [monthlyDate, setMonthlyDate] = useState();
    const [currentTask, setCurrentTask] = useState('');
    const [nextRunTime, setNextRunTime] = useState('')

    const handleCreateBackup = async () => {
        if (!handleEmpty()) return;
        let timeExpression = '';
        let type;
        switch (backupType) {
            case 'daily':
                type = 1;
                timeExpression = `${dailyTime?.hour()}-${dailyTime?.minute()}`; // 获取小时和分钟
                break;
            case 'weekly':
                type = 3;
                timeExpression = `${weeklyDate}-${dailyTime?.hour()}-${dailyTime?.minute()}`; // 直接使用选择的日期
                break;
            case 'monthly':
                type = 2;
                timeExpression = `${monthlyDate}-${dailyTime?.hour()}-${dailyTime?.minute()}`; // 直接使用选择的日期
                break;
        }
        // 调用 scheduleBackup API
        try {
            await backupApi.scheduleBackup({ timeExpression, type });
            notification.success({
                message: '成功',
                description: '备份创建成功',
            });
            refetch();
        } catch (error) {
            notification.error({
                message: '错误',
                description: '备份创建失败',
            });
        }
    };

    const handleEmpty = () => {

        if (backupType === 'weekly') {
            if (!weeklyDate) {
                notification.error({
                    message: '错误',
                    description: '请设置每周备份的时间',
                });
                return false;
            }
        } else if (backupType === 'monthly') {
            if (!monthlyDate) {
                notification.error({
                    message: '错误',
                    description: '请设置每月备份的日期',
                });
                return false;
            }
        }
        if (dailyTime === null) {
            notification.error({
                message: '错误',
                description: '请选择时间',
            });
            return false
        }
        return true;
    };

    const refetch = async () => {
        const { meaning, nextRunTime } = await backupApi.getCurrentTask();
        setCurrentTask(meaning);
        setNextRunTime(nextRunTime)
    }
    const handleBackupImmediately = async () => {
        try {
            await backupApi.backupImmediately()
            notification.success({
                message: '成功',
                description: '备份创建成功',
            });
        } catch (error) {
            notification.error({
                message: '错误',
                description: '备份创建失败',
            });
        }
    }
    useEffect(() => {
        refetch();
    }, []);
    const whichComponent = useMemo(() => {
        switch (backupType) {
            case 'daily':
                return <></>
            case 'weekly':
                return <Select
                    value={weeklyDate}
                    onChange={(value) => setWeeklyDate(value)}
                    style={{ width: 150 }}
                    placeholder="请选择星期" // 添加占位符以改善用户体验
                >
                    {week.map((day, index) => (
                        <Select.Option key={index} value={index + 1}>{day}</Select.Option>
                    ))}
                </Select>
            case 'monthly':
                return <Select
                    style={{ width: 150 }}
                    value={monthlyDate}
                    onChange={(value) => setMonthlyDate(value)}
                    placeholder="请选择日期" // 添加占位符以改善用户体验
                >
                    {[...Array(28).keys()].map(day => (
                        <Select.Option key={day} value={day + 1}>{`${day + 1}号`}</Select.Option>
                    ))}
                </Select>
        }

    }, [backupType, weeklyDate, monthlyDate])
    return (
        <Space direction='vertical' style={{ padding: '20px', width: '100%' }}>
            <Button type="primary" onClick={handleBackupImmediately}>此刻立即备份</Button>
            <Card title="备份信息">
                <Row gutter={16}   >
                    <Col span={8}>
                        <Flex vertical>
                            <Space direction='vertical'>
                                <Typography.Title level={5} style={{ margin: 0 }}>最新备份任务时间</Typography.Title>
                                <Input value={nextRunTime} disabled />
                            </Space>
                            <Space direction='vertical'>
                                <Typography.Title level={5} style={{ margin: 0 }}>当前备份任务时间</Typography.Title>
                                <Input value={currentTask} disabled />
                            </Space>
                        </Flex>
                    </Col>
                    <Col span={8}>
                        <Space direction='vertical'>
                            <Typography.Title level={5} style={{ margin: 0 }}>选择备份类型</Typography.Title>
                            <Select
                                value={backupType}
                                onChange={(value) => setBackupType(value)}
                            >
                                <Select.Option value="daily">每日备份</Select.Option>
                                <Select.Option value="weekly">每周备份</Select.Option>
                                <Select.Option value="monthly">每月备份</Select.Option>
                            </Select>
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Card title="请选择每月执行备份的日期">
                <Space>
                    {whichComponent}
                    <TimePicker value={dailyTime} onChange={(time) => setDailyTime(time)} />
                    <Popover content="即时备份">
                        <Button type="primary" onClick={handleCreateBackup}>确认备份</Button>
                    </Popover>
                </Space>
            </Card>
        </Space>
    );
};

export default Backup;
