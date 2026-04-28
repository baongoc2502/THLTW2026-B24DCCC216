import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Popconfirm,
  Tag,
} from 'antd';
import moment from 'moment';
import { getData, setData, STORAGE_KEYS } from '../utils/storage';

interface Health {
  id: string;
  date: string;
  weight: number;
  height: number;
  bmi: number;
  heartRate: number;
  sleep: number;
}

const calculateBMI = (weight: number, height: number) => {
  const h = height / 100;
  return weight / (h * h);
};

const getBMITag = (bmi: number) => {
  if (bmi < 18.5) return { color: 'blue', label: 'Thiếu cân' };
  if (bmi < 25) return { color: 'green', label: 'Bình thường' };
  if (bmi < 30) return { color: 'gold', label: 'Thừa cân' };
  return { color: 'red', label: 'Béo phì' };
};

const HealthLog: React.FC = () => {
  const [data, setDataState] = useState<Health[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Health | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const stored = getData(STORAGE_KEYS.HEALTH);
    setDataState(stored);
  }, []);

  const saveData = (newData: Health[]) => {
    setDataState(newData);
    setData(STORAGE_KEYS.HEALTH, newData);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const bmi = calculateBMI(values.weight, values.height);

      const newItem: Health = {
        ...values,
        id: editing ? editing.id : Date.now().toString(),
        date: values.date.format(),
        bmi: Number(bmi.toFixed(1)),
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

  const openEdit = (record: Health) => {
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
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      render: (bmi: number) => {
        const tag = getBMITag(bmi);
        return (
          <>
            {bmi}{' '}
            <Tag color={tag.color}>
              {tag.label}
            </Tag>
          </>
        );
      },
    },
    {
      title: 'Nhịp tim (bpm)',
      dataIndex: 'heartRate',
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleep',
    },
    {
      title: 'Hành động',
      render: (_: any, record: Health) => (
        <Space>
          <Button onClick={() => openEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xóa chỉ số?"
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
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditing(null);
          setModalVisible(true);
          form.resetFields();
        }}
      >
        + Thêm chỉ số
      </Button>

      <Table rowKey="id" columns={columns} dataSource={data} />

      <Modal
        title={editing ? 'Sửa chỉ số' : 'Thêm chỉ số'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="heartRate" label="Nhịp tim (bpm)">
            <InputNumber min={30} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="sleep" label="Giờ ngủ">
            <InputNumber min={0} max={24} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HealthLog;