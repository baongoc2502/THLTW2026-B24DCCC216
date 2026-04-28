import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Progress,
  Popconfirm,
  Segmented,
  Space,
  Tag,
} from 'antd';
import moment from 'moment';
import { getData, setData, STORAGE_KEYS } from '../utils/storage';

const { Option } = Select;

interface Goal {
  id: string;
  name: string;
  type: string;
  target: number;
  current: number;
  deadline: string;
  status: string;
}

const Goals: React.FC = () => {
  const [data, setDataState] = useState<Goal[]>([]);
  const [filtered, setFiltered] = useState<Goal[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const stored = getData(STORAGE_KEYS.GOALS);
    setDataState(stored);
    setFiltered(stored);
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFiltered(data);
    } else {
      setFiltered(data.filter((g) => g.status === filter));
    }
  }, [filter, data]);

  const saveData = (newData: Goal[]) => {
    setDataState(newData);
    setData(STORAGE_KEYS.GOALS, newData);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newItem: Goal = {
        ...values,
        id: editing ? editing.id : Date.now().toString(),
        deadline: values.deadline.format(),
      };

      let newData;

      if (editing) {
        newData = data.map((g) =>
          g.id === editing.id ? newItem : g
        );
      } else {
        newData = [...data, newItem];
      }

      saveData(newData);
      setDrawerVisible(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    const newData = data.filter((g) => g.id !== id);
    saveData(newData);
  };

  const updateCurrent = (id: string, value: number) => {
    const newData = data.map((g) => {
      if (g.id === id) {
        const updated = { ...g, current: value };

        if (value >= g.target) {
          updated.status = 'done';
        }

        return updated;
      }
      return g;
    });

    saveData(newData);
  };

  const openEdit = (goal: Goal) => {
    setEditing(goal);
    setDrawerVisible(true);

    form.setFieldsValue({
      ...goal,
      deadline: moment(goal.deadline),
    });
  };

  return (
    <div>
      <Segmented
        options={[
          { label: 'Tất cả', value: 'all' },
          { label: 'Đang thực hiện', value: 'active' },
          { label: 'Đã đạt', value: 'done' },
          { label: 'Đã hủy', value: 'cancel' },
        ]}
        onChange={(val) => setFilter(val as string)}
        style={{ marginBottom: 16 }}
      />

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditing(null);
          setDrawerVisible(true);
          form.resetFields();
        }}
      >
        + Thêm mục tiêu
      </Button>

      <Row gutter={[16, 16]}>
        {filtered.map((g) => {
          const percent = Math.min((g.current / g.target) * 100, 100);

          return (
            <Col span={8} key={g.id}>
              <Card
                title={g.name}
                extra={
                  <Space>
                    <Button size="small" onClick={() => openEdit(g)}>
                      Sửa
                    </Button>
                    <Popconfirm
                      title="Xóa mục tiêu?"
                      onConfirm={() => handleDelete(g.id)}
                    >
                      <Button size="small" danger>
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Space>
                }
              >
                <p>Loại: {g.type}</p>

                <p>
                  Deadline: {moment(g.deadline).format('DD/MM/YYYY')}
                </p>

                <p>
                  Trạng thái:{' '}
                  <Tag
                    color={
                      g.status === 'done'
                        ? 'green'
                        : g.status === 'cancel'
                        ? 'red'
                        : 'blue'
                    }
                  >
                    {g.status === 'done'
                      ? 'Đã đạt'
                      : g.status === 'cancel'
                      ? 'Đã hủy'
                      : 'Đang thực hiện'}
                  </Tag>
                </p>

                <Progress percent={Number(percent.toFixed(0))} />

                <div style={{ marginTop: 10 }}>
                  <span>Hiện tại: </span>
                  <InputNumber
                    min={0}
                    value={g.current}
                    onChange={(val) =>
                      updateCurrent(g.id, val ?? 0)
                    }
                  />
                  <span> / {g.target}</span>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Drawer
        title={editing ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={400}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setDrawerVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Lưu
            </Button>
          </div>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select>
              <Option value="Giảm cân">Giảm cân</Option>
              <Option value="Tăng cơ">Tăng cơ</Option>
              <Option value="Sức bền">Cải thiện sức bền</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="target" label="Mục tiêu" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="current" label="Hiện tại" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Option value="active">Đang thực hiện</Option>
              <Option value="done">Đã đạt</Option>
              <Option value="cancel">Đã hủy</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Goals;