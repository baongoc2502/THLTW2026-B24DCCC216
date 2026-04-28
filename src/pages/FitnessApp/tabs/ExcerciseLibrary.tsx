import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Modal,
  Form,
  InputNumber,
  Tag,
  Space,
  Popconfirm,
} from 'antd';
import { getData, setData, STORAGE_KEYS } from '../utils/storage';

const { Option } = Select;

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  level: string;
  description: string;
  calories: number;
}

const ExerciseLibrary: React.FC = () => {
  const [data, setDataState] = useState<Exercise[]>([]);
  const [filtered, setFiltered] = useState<Exercise[]>([]);
  const [search, setSearch] = useState('');
  const [muscle, setMuscle] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();

  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [selected, setSelected] = useState<Exercise | null>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const stored = getData(STORAGE_KEYS.EXERCISES);
    setDataState(stored);
    setFiltered(stored);
  }, []);

  useEffect(() => {
    let temp = [...data];

    if (search) {
      temp = temp.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (muscle) {
      temp = temp.filter((e) => e.muscle === muscle);
    }

    if (level) {
      temp = temp.filter((e) => e.level === level);
    }

    setFiltered(temp);
  }, [search, muscle, level, data]);

  const saveData = (newData: Exercise[]) => {
    setDataState(newData);
    setData(STORAGE_KEYS.EXERCISES, newData);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newItem: Exercise = {
        ...values,
        id: editing ? editing.id : Date.now().toString(),
      };

      let newData;

      if (editing) {
        newData = data.map((e) =>
          e.id === editing.id ? newItem : e
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
    const newData = data.filter((e) => e.id !== id);
    saveData(newData);
  };

  const openEdit = (e: Exercise) => {
    setEditing(e);
    setModalVisible(true);
    form.setFieldsValue(e);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Input
            placeholder="Tìm bài tập"
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col span={6}>
          <Select
            allowClear
            placeholder="Nhóm cơ"
            style={{ width: '100%' }}
            onChange={setMuscle}
          >
            <Option value="Chest">Chest</Option>
            <Option value="Back">Back</Option>
            <Option value="Legs">Legs</Option>
            <Option value="Shoulders">Shoulders</Option>
            <Option value="Arms">Arms</Option>
            <Option value="Core">Core</Option>
            <Option value="Full Body">Full Body</Option>
          </Select>
        </Col>

        <Col span={6}>
          <Select
            allowClear
            placeholder="Mức độ"
            style={{ width: '100%' }}
            onChange={setLevel}
          >
            <Option value="easy">Dễ</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="hard">Khó</Option>
          </Select>
        </Col>

        <Col span={6}>
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

      <Row gutter={[16, 16]}>
        {filtered.map((e) => (
          <Col span={8} key={e.id}>
            <Card
              hoverable
              onClick={() => {
                setSelected(e);
                setDetailVisible(true);
              }}
              extra={
                <Space onClick={(ev) => ev.stopPropagation()}>
                  <Button size="small" onClick={() => openEdit(e)}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa bài tập?"
                    onConfirm={() => handleDelete(e.id)}
                  >
                    <Button size="small" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              <h3>{e.name}</h3>

              <p>Nhóm cơ: {e.muscle}</p>

              <Tag
                color={
                  e.level === 'easy'
                    ? 'green'
                    : e.level === 'medium'
                    ? 'gold'
                    : 'red'
                }
              >
                {e.level === 'easy'
                  ? 'Dễ'
                  : e.level === 'medium'
                  ? 'Trung bình'
                  : 'Khó'}
              </Tag>

              <p>{e.description}</p>

              <p>Calo/giờ: {e.calories}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        visible={detailVisible}
        title={selected?.name}
        onCancel={() => setDetailVisible(false)}
        footer={null}
      >
        {selected && (
          <>
            <p><b>Nhóm cơ:</b> {selected.muscle}</p>
            <p><b>Mức độ:</b> {selected.level}</p>
            <p><b>Mô tả:</b> {selected.description}</p>
            <p><b>Calo/giờ:</b> {selected.calories}</p>
          </>
        )}
      </Modal>

      <Modal
        visible={modalVisible}
        title={editing ? 'Sửa bài tập' : 'Thêm bài tập'}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="muscle" label="Nhóm cơ" rules={[{ required: true }]}>
            <Select>
              <Option value="Chest">Chest</Option>
              <Option value="Back">Back</Option>
              <Option value="Legs">Legs</Option>
              <Option value="Shoulders">Shoulders</Option>
              <Option value="Arms">Arms</Option>
              <Option value="Core">Core</Option>
              <Option value="Full Body">Full Body</Option>
            </Select>
          </Form.Item>

          <Form.Item name="level" label="Mức độ" rules={[{ required: true }]}>
            <Select>
              <Option value="easy">Dễ</Option>
              <Option value="medium">Trung bình</Option>
              <Option value="hard">Khó</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>

          <Form.Item name="calories" label="Calo/giờ" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExerciseLibrary;