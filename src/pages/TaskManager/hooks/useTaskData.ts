import { useState, useEffect } from 'react';
import type { Task} from '../types';
import { TaskStatus } from '../types';

const STORAGE_KEY = 'tasks';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Học React',
    description: 'Tìm hiểu useState, useEffect',
    deadline: '2025-06-01',
    priority: 'Cao',
    tags: ['React', 'Frontend'],
    status: 'todo',
    createdAt: '2025-05-01',
  },
  {
    id: '2',
    title: 'Viết blog',
    description: 'Viết về React hooks',
    deadline: '2025-05-20',
    priority: 'Trung bình',
    tags: ['Writing'],
    status: 'doing',
    createdAt: '2025-05-02',
  },
  {
    id: '3',
    title: 'Làm bài tập',
    description: 'Hoàn thành bài tập TypeScript',
    deadline: '2025-05-15',
    priority: 'Cao',
    tags: ['TypeScript'],
    status: 'done',
    createdAt: '2025-05-03',
  },
];

export default function useTaskData() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      setTasks(initialTasks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    }
  }, []);

  useEffect(() => {
    if (tasks.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newId = Date.now().toString();
    const newTask: Task = {
      ...task,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getTaskById = (id: string) => tasks.find(t => t.id === id);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.status !== 'done' && t.deadline < new Date().toISOString().split('T')[0]).length,
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTaskById,
    stats,
  };
}