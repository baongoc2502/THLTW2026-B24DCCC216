import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Timeline, Empty } from 'antd';
import { Column, Line } from '@ant-design/plots';
import moment from 'moment';
import { getData, STORAGE_KEYS } from '../utils/storage';

const Dashboard: React.FC = () => {
  const workouts = getData(STORAGE_KEYS.WORKOUTS);
  const health = getData(STORAGE_KEYS.HEALTH);
  const goals = getData(STORAGE_KEYS.GOALS);

  const stats = useMemo(() => {
    const now = moment();

    const monthlyWorkouts = workouts.filter((w: any) =>
      moment(w.date).isSame(now, 'month')
    );

    const totalCalories = monthlyWorkouts.reduce(
      (sum: number, w: any) => sum + (w.calories || 0),
      0
    );

    let streak = 0;
    let current = moment();

    while (
      workouts.find((w: any) =>
        moment(w.date).isSame(current, 'day')
      )
    ) {
      streak++;
      current = current.subtract(1, 'day');
    }

    const goal = goals[0];
    let progress = 0;
    if (goal) {
      progress = (goal.current / goal.target) * 100;
    }

    return {
      totalWorkouts: monthlyWorkouts.length,
      totalCalories,
      streak,
      progress: Math.min(progress, 100).toFixed(0),
    };
  }, [workouts, goals]);

  const weeklyData = useMemo(() => {
    const weeks: any = {};

    workouts.forEach((w: any) => {
      const week = moment(w.date).week();
      weeks[week] = (weeks[week] || 0) + 1;
    });

    return Object.keys(weeks).map((week) => ({
      week: `Tuần ${week}`,
      count: weeks[week],
    }));
  }, [workouts]);

  const columnConfig = {
    data: weeklyData,
    xField: 'week',
    yField: 'count',
  };

  const weightData = useMemo(() => {
    return health.map((h: any) => ({
      date: moment(h.date).format('DD/MM'),
      weight: h.weight,
    }));
  }, [health]);

  const lineConfig = {
    data: weightData,
    xField: 'date',
    yField: 'weight',
    smooth: true,
  };

  const recentWorkouts = [...workouts]
    .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
    .slice(0, 5);

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Buổi tập tháng" value={stats.totalWorkouts} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Calo đốt" value={stats.totalCalories} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Streak (ngày)" value={stats.streak} />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic title="Hoàn thành (%)" value={stats.progress} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Số buổi tập theo tuần">
            <Column {...columnConfig} />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Cân nặng theo thời gian">
            <Line {...lineConfig} />
          </Card>
        </Col>
      </Row>

      <Card title="5 buổi tập gần nhất" style={{ marginTop: 20 }}>
        {recentWorkouts.length === 0 ? (
          <Empty />
        ) : (
          <Timeline>
            {recentWorkouts.map((w: any, i: number) => (
              <Timeline.Item key={i}>
                {moment(w.date).format('DD/MM')} - {w.type} - {w.duration} phút
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;