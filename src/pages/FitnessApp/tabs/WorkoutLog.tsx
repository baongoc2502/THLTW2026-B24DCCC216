import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  Tag,
  Row,
  Col,
} from 'antd';
import moment from 'moment';
import { getData, setData, STORAGE_KEYS } from '../utils/storage';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface Workout {
  id: string;
  date: string;
  type: string;
  duration: number;
  calories: number;
  note: string;
  status: string;
}

const WorkoutLog: React.FC = () => {
  const [data, setDataState] = useState<Workout[]>([]);
  const [filteredData, setFilteredData] = useState<Workout[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Workout | null>(null);
  const [form] = Form.useForm();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<any>();

  useEffect(() => {
    const stored = getData(STORAGE_KEYS.WORKOUTS);
    setDataState(stored);
    setFilteredData(stored);
  }, []);

  useEffect(() => {
    let temp = [...data];

    if (search) {
      temp = temp.filter((w) =>
        w.type.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter) {
      temp = temp.filter((w) => w.type === typeFilter);
    }

    if (dateRange) {
      temp = temp.filter((w) =>
        moment(w.date).isBetween(dateRange[0], dateRange[1], null, '[]')
      );
    }

    setFilteredData(temp);
  }, [search, typeFilter, dateRange, data]);

  const saveData = (newData: Workout[]) => {
    setDataState(newData);
    setData(STORAGE_KEYS.WORKOUTS, newData);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newItem: Workout = {
        ...values,
        id: editing ? editing.id : Date.now().toString(),
        date: values.date.format(),
      };

      let newData;

      if (editing) {
        newData = data.map((item) =>
          item.id === editing.id ? newItem : item
        );
      } else {
        newData = [...data, newItem];
      }

      saveData(newData);
      setModalVisible(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const handleDelete = (id: string) => {
    const newData = data.filter((item) => item.id !== id);
    saveData(newData);
  };

  const openEdit = (record: Workout) => {
    setEditing(record);
    setModalVisible(true);

    form.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      render: (d: string) => moment(d).format('DD/MM/YYYY'),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
    },
    {
      title: 'Calo',
      dataIndex: 'calories',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: string) =>
        s === 'done' ? <Tag color="green">Hoàn thành</Tag> : <Tag color="red">Bỏ lỡ</Tag>,
    },
    {
      title: 'Hành động',
      render: (_: any, record: Workout) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xóa buổi tập?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Tìm theo loại bài tập"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col span={6}>
          <Select
            allowClear
            placeholder="Lọc loại"
            style={{ width: '100%' }}
            onChange={setTypeFilter}
          >
            <Option value="Cardio">Cardio</Option>
            <Option value="Strength">Strength</Option>
            <Option value="Yoga">Yoga</Option>
            <Option value="HIIT">HIIT</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Col>

        <Col span={8}>
          <RangePicker style={{ width: '100%' }} onChange={setDateRange} />
        </Col>

        <Col span={4}>
          <Button
            type="primary"
            block
            onClick={() => {
              setEditing(null);
              setModalVisible(true);
              form.resetFields();
            }}
          >
            + Thêm
          </Button>
        </Col>
      </Row>

      <Table rowKey="id" columns={columns} dataSource={filteredData} />

      <Modal
        title={editing ? 'Sửa buổi tập' : 'Thêm buổi tập'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select>
              <Option value="Cardio">Cardio</Option>
              <Option value="Strength">Strength</Option>
              <Option value="Yoga">Yoga</Option>
              <Option value="HIIT">HIIT</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="duration" label="Thời lượng" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="calories" label="Calo" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Option value="done">Hoàn thành</Option>
              <Option value="missed">Bỏ lỡ</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutLog;