import React from 'react';
import { Tabs } from 'antd';

import Dashboard from './tabs/Dashboard';
import WorkoutLog from './tabs/WorkoutLog';
import HealthLog from './tabs/HealthLog';
import Goals from './tabs/Goals';
import ExerciseLibrary from './tabs/ExcerciseLibrary';

const { TabPane } = Tabs;

const FitnessApp: React.FC = () => {
  return (
    <Tabs defaultActiveKey="dashboard">
      <TabPane tab="Dashboard" key="dashboard">
        <Dashboard />
      </TabPane>

      <TabPane tab="Nhật ký tập luyện" key="workout">
        <WorkoutLog />
      </TabPane>

      <TabPane tab="Chỉ số sức khỏe" key="health">
        <HealthLog />
      </TabPane>

      <TabPane tab="Mục tiêu" key="goals">
        <Goals />
      </TabPane>

      <TabPane tab="Thư viện bài tập" key="library">
        <ExerciseLibrary />
      </TabPane>
    </Tabs>
  );
};

export default FitnessApp;