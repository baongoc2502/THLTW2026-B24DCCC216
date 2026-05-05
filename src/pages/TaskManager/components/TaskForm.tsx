import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Tag } from 'antd';
import { Task, Priority } from '../types';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        deadline: moment(initialValues.deadline),
      });
    } else if (visible && !initialValues) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      const formatted = {
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD'),
        tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
      };
      onSubmit(formatted);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={600}
    >
      <Form form={form} layout="vertical" initialValues={{ priority: 'Trung bình', status: 'todo' }}>
        <Form.Item name="title" label="Tên công việc" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name="deadline" label="Hạn chót" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="priority" label="Mức độ ưu tiên">
          <Select>
            <Option value="Cao"><Tag color="red">Cao</Tag></Option>
            <Option value="Trung bình"><Tag color="orange">Trung bình</Tag></Option>
            <Option value="Thấp"><Tag color="blue">Thấp</Tag></Option>
          </Select>
        </Form.Item>
        <Form.Item name="tags" label="Tag (cách nhau bằng dấu phẩy)">
          <Input placeholder="VD: React, Frontend" />
        </Form.Item>
        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Option value="todo">Cần làm</Option>
            <Option value="doing">Đang làm</Option>
            <Option value="done">Hoàn thành</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;