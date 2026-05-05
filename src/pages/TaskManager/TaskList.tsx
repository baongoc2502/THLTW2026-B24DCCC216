import React, { useState, useMemo } from 'react';
import { Table, Input, Select, Space, Button, Popconfirm, Tag, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useTaskData from './hooks/useTaskData';
import TaskForm from './components/TaskForm';
import { Task } from './types';

const { Option } = Select;

const TaskList: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskData();
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (searchText) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (filterStatus) {
      filtered = filtered.filter(t => t.status === filterStatus);
    }
    return filtered.sort((a, b) => a.deadline.localeCompare(b.deadline));
  }, [tasks, searchText, filterStatus]);

  const columns = [
    { title: 'Tên công việc', dataIndex: 'title' },
    { title: 'Mô tả', dataIndex: 'description' },
    { title: 'Hạn chót', dataIndex: 'deadline', sorter: (a: Task, b: Task) => a.deadline.localeCompare(b.deadline) },
    { title: 'Ưu tiên', dataIndex: 'priority', render: (p: string) => <Tag color={p === 'Cao' ? 'red' : p === 'Trung bình' ? 'orange' : 'blue'}>{p}</Tag> },
    { title: 'Tag', dataIndex: 'tags', render: (tags: string[]) => tags.map(t => <Tag key={t}>{t}</Tag>) },
    { title: 'Trạng thái', dataIndex: 'status', render: (s: string) => s === 'todo' ? 'Cần làm' : s === 'doing' ? 'Đang làm' : 'Hoàn thành' },
    {
      title: 'Thao tác',
      render: (_: any, record: Task) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => { setEditingTask(record); setModalVisible(true); }} />
          <Popconfirm title="Xóa?" onConfirm={() => deleteTask(record.id)}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleFormSubmit = (values: any) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
      message.success('Cập nhật thành công');
    } else {
      addTask(values);
      message.success('Thêm thành công');
    }
    setModalVisible(false);
    setEditingTask(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <Input.Search placeholder="Tìm theo tên" onChange={e => setSearchText(e.target.value)} style={{ width: 250 }} allowClear />
        <Select placeholder="Lọc trạng thái" allowClear onChange={setFilterStatus} style={{ width: 150 }}>
          <Option value="todo">Cần làm</Option>
          <Option value="doing">Đang làm</Option>
          <Option value="done">Hoàn thành</Option>
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingTask(null); setModalVisible(true); }}>Thêm task</Button>
      </Space>
      <Table dataSource={filteredTasks} columns={columns} rowKey="id" pagination={{ pageSize: 5 }} />
      <TaskForm visible={modalVisible} onCancel={() => setModalVisible(false)} onSubmit={handleFormSubmit} initialValues={editingTask} />
    </div>
  );
};

export default TaskList;