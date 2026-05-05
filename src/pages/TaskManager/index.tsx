import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import useTaskData from './hooks/useTaskData';

const Dashboard: React.FC = () => {
  const { stats } = useTaskData();

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số công việc"
              value={stats.total}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Quá hạn"
              value={stats.overdue}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;