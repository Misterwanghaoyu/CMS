import React, { useEffect, useState } from 'react';
import { TimePicker, DatePicker, Select, Button, Typography, Row, Col, App, Space, Input, Card, Statistic } from 'antd';
import { backupApi } from '@/request/api';
import dayjs from 'dayjs';
const { Title } = Typography;
// 2025/01/12
const Backup = () => {
    const { notification } = App.useApp()
    const [backupType, setBackupType] = useState('daily'); // 新增状态来选择备份类型
    const [dailyTime, setDailyTime] = useState<dayjs.Dayjs | null>(null);
    const [monthlyDate, setMonthlyDate] = useState('');
    const [currentTask, setCurrentTask] = useState<string>('');
    // const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);


    const handleCreateBackup = async () => {
        if (!handleEmpty()) return;
        let meaning = '';
        let type = backupType === 'daily' ? 1 : 2;

        if (backupType === 'daily' && dailyTime) {
            meaning = `${dailyTime.hour()}-${dailyTime.minute()}`; // 获取小时和分钟
        } else if (backupType === 'monthly' && monthlyDate) {
            meaning = monthlyDate; // 直接使用选择的日期
        }
        // 调用 scheduleBackup API
        try {
            const response = await backupApi.scheduleBackup({ meaning, type });
            console.log('备份创建成功:', response);
            notification.success({
                message: '成功',
                description: '备份创建成功',
            });
            refetch();
        } catch (error) {
            console.error('备份创建失败:', error);
            notification.error({
                message: '错误',
                description: '备份创建失败',
            });
        }
    };

    const handleEmpty = () => {
        if (backupType === 'daily') {
            if (!dailyTime) {
                notification.error({
                    message: '错误',
                    description: '请设置每日备份的时间',
                });
                return false;
            }
            // if (!startDate) {
            //     notification.error({
            //         message: '错误',
            //         description: '请设置开始时间',
            //     });
            //     return false;
            // }
        } else if (backupType === 'monthly') {
            if (!monthlyDate) {
                notification.error({
                    message: '错误',
                    description: '请设置每月备份的日期',
                });
                return false;
            }
            // if (!startDate) {
            //     notification.error({
            //         message: '错误',
            //         description: '请设置开始时间',
            //     });
            //     return false;
            // }
        }
        return true;
    };

    const refetch = async () => {
        const res = await backupApi.getCurrentTask();
        setCurrentTask(res.meaning);
    }
    useEffect(() => {
        refetch();
    }, []);
    return (
        <div style={{ padding: '20px' }}>
            {/* <Statistic title="当前备份任务时间" value={currentTask} /> */}
            <Space>
                <Typography.Title level={3} style={{ margin: 0 }}>当前备份任务时间</Typography.Title>
                <Input value={currentTask} disabled/>
            </Space>
            <Title level={2}>选择备份类型</Title>
            <Select
                value={backupType}
                onChange={(value) => setBackupType(value)}
                style={{ width: '100%', marginBottom: '20px' }}
            >
                <Select.Option value="daily">每日备份</Select.Option>
                <Select.Option value="monthly">每月备份</Select.Option>
            </Select>

            {backupType === 'daily' && ( // 根据选择显示每日备份组件
                <>
                    <Title level={3}>每日执行备份</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <label>
                                请选择每天执行备份的时间:
                                <TimePicker
                                    value={dailyTime}
                                    onChange={(time) => setDailyTime(time)}
                                    style={{ width: '100%', marginTop: '8px' }}
                                />
                            </label>
                        </Col>
                        <Col span={12}>
                            {/* <label>
                                开始时间:
                                <DatePicker 
                                    showTime 
                                    value={startDate} 
                                    onChange={(date) => setStartDate(date)} 
                                    style={{ width: '100%', marginTop: '8px' }} 
                                />
                            </label> */}
                        </Col>
                    </Row>
                </>
            )}

            {backupType === 'monthly' && ( // 根据选择显示每月备份组件
                <>
                    <Title level={3} >每月执行备份</Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <label>
                                请选择每月执行备份的日期:
                                <Select
                                    value={monthlyDate}
                                    onChange={(value) => setMonthlyDate(value)}
                                    style={{ width: '100%', marginTop: '8px' }}
                                >
                                    {[...Array(31).keys()].map(day => (
                                        <Select.Option key={day} value={day + 1}>{day + 1}</Select.Option>
                                    ))}
                                </Select>
                            </label>
                        </Col>
                        <Col span={12}>
                            {/* <label>
                                开始时间:
                                <DatePicker 
                                    picker="month" 
                                    value={startDate} 
                                    onChange={(date) => setStartDate(date)} 
                                    style={{ width: '100%', marginTop: '8px' }} 
                                />
                            </label> */}
                        </Col>
                    </Row>
                </>
            )}

            <Button type="primary" onClick={handleCreateBackup} style={{ marginTop: '20px' }}>创建备份时间</Button>
        </div>
    );
};

export default Backup;
