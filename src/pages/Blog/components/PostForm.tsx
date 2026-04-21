import { Modal, Form, Input, Select, message } from "antd";

export default ({ visible, onOk, onCancel, initial }: any) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (error) {
      message.error("Vui lòng điền đầy đủ thông tin");
    }
  };

  return (
    <Modal
      title={initial ? "Sửa bài viết" : "Thêm bài viết mới"}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={700}
    >
      <Form
        form={form}
        initialValues={initial}
        layout="vertical"
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug (đường dẫn)"
          rules={[
            { required: true, message: "Vui lòng nhập slug" },
            { pattern: /^[a-z0-9-]+$/, message: "Slug chỉ gồm chữ thường, số và dấu gạch ngang" }
          ]}
        >
          <Input placeholder="vi-du-slug" />
        </Form.Item>

        <Form.Item
          name="summary"
          label="Tóm tắt"
          rules={[{ required: true, message: "Vui lòng nhập tóm tắt" }]}
        >
          <Input.TextArea rows={2} placeholder="Tóm tắt nội dung bài viết" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung (Markdown)"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <Input.TextArea rows={8} placeholder="Hỗ trợ **Markdown**" />
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label="Ảnh đại diện (URL)"
          rules={[{ required: true, message: "Vui lòng nhập URL ảnh" }]}
        >
          <Input placeholder="https://picsum.photos/id/1/300/200" />
        </Form.Item>

        <Form.Item
          name="author"
          label="Tác giả"
          rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
        >
          <Input placeholder="Tên tác giả" />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Thẻ"
          rules={[{ required: true, message: "Vui lòng chọn ít nhất một thẻ" }]}
        >
          <Select
            mode="tags"
            placeholder="Nhập thẻ và nhấn Enter"
            tokenSeparators={[","]}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select>
            <Select.Option value="draft">Nháp</Select.Option>
            <Select.Option value="published">Đã đăng</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};