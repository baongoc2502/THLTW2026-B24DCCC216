import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Typography, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import useTaskData from './hooks/useTaskData';
import TaskForm from './components/TaskForm';
import type { Task, TaskStatus } from './types';

const { Title } = Typography;

const columnTitles: Record<TaskStatus, string> = {
  todo: 'Cần làm',
  doing: 'Đang làm',
  done: 'Hoàn thành',
};

const Kanban: React.FC = () => {
  const { tasks, updateTask, deleteTask } = useTaskData();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    updateTask(draggableId, { status: destination.droppableId as TaskStatus });
  };

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSubmit = (values: any) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    }
    setModalVisible(false);
    setEditingTask(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto' }}>
          {(['todo', 'doing', 'done'] as TaskStatus[]).map(status => (
            <div key={status} style={{ flex: 1, minWidth: 300 }}>
              <Title level={4}>{columnTitles[status]}</Title>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{ background: '#f5f5f5', padding: 8, borderRadius: 8, minHeight: 500 }}
                  >
                    {getTasksByStatus(status).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            style={{ marginBottom: 8, ...draggableProvided.draggableProps.style }}
                          >
                            <Card
                              title={task.title}
                              extra={
                                <Space>
                                  <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(task)} />
                                  <Button icon={<DeleteOutlined />} danger size="small" onClick={() => deleteTask(task.id)} />
                                </Space>
                              }
                            >
                              <p>{task.description}</p>
                              <p>Hạn: {task.deadline}</p>
                              <Tag color={task.priority === 'Cao' ? 'red' : task.priority === 'Trung bình' ? 'orange' : 'blue'}>
                                {task.priority}
                              </Tag>
                              {task.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <TaskForm
        visible={modalVisible}
        onCancel={() => { setModalVisible(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        initialValues={editingTask}
      />
    </div>
  );
};

export default Kanban;