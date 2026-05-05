import React from 'react';
import { Tabs } from 'antd';
import Dashboard from './index';
import Kanban from './Kanban';
import TaskList from './TaskList';

const { TabPane } = Tabs;

const TaskManager: React.FC = () => {
  return (
    <div style={{ background: '#fff' }}>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Dashboard" key="1"><Dashboard /></TabPane>
        <TabPane tab="Kanban Board" key="2"><Kanban /></TabPane>
        <TabPane tab="Danh sách Task" key="3"><TaskList /></TabPane>
      </Tabs>
    </div>
  );
};

export default TaskManager;