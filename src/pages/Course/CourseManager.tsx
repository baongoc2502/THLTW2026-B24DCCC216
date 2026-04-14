import React, { useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  message,
  Tag,
} from "antd";

const { Option } = Select;
const { Search } = Input;

type CourseStatus = "OPEN" | "CLOSED" | "PAUSED";

interface Course {
  id: number;
  name: string;
  instructor: string;
  students: number;
  description: string;
  status: CourseStatus;
}

const instructors = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"];

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: "ReactJS",
      instructor: "Nguyễn Văn A",
      students: 10,
      description: "<p>React cơ bản</p>",
      status: "OPEN",
    },
    {
      id: 2,
      name: "Python cơ bản",
      instructor: "Nguyễn Văn A",
      students: 12,
      description: "<p>Python cơ bản</p>",
      status: "CLOSED",
    },
    {
      id: 3,
      name: "Lập Trình Web",
      instructor: "Trần Thị B",
      students: 8,
      description: "<p>Lập Trình Web</p>",
      status: "CLOSED",
    },
    {
      id: 4,
      name: "Java nâng cao",
      instructor: "Lê Văn C",
      students: 7,
      description: "<p>Java nâng cao</p>",
      status: "PAUSED",
    },
    {
      id: 5,
      name: "UI/UX Design",
      instructor: "Trần Thị B",
      students: 0,
      description: "<p>Thiết kế UI/UX</p>",
      status: "OPEN",
    },
    {
      id: 6,
      name: "JavaScripts nâng cao",
      instructor: "Lê Văn C",
      students: 20,
      description: "<p>JavaScript nâng cao</p>",
      status: "PAUSED",
    },
    {
      id: 7,
      name: "Khoa Học Máy Tính",
      instructor: "Lê Văn C",
      students: 9,
      description: "<p>Khoa Học Máy Tính</p>",
      status: "OPEN",
    },
    {
      id: 8,
      name: "Hệ Thống Thông Tin",
      instructor: "Lê Văn C",
      students: 5,
      description: "<p>Hệ Thống Thông Tin</p>",
      status: "CLOSED",
    },
  ]);

  const [filtered, setFiltered] = useState<Course[]>(courses);
  const [searchText, setSearchText] = useState("");
  const [filterInstructor, setFilterInstructor] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<CourseStatus | undefined>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();

  // ✅ Tạo ID = max + 1
  const getNextId = () => {
    if (courses.length === 0) return 1;
    return Math.max(...courses.map((c) => c.id)) + 1;
  };

  // 🔍 SEARCH + FILTER
  const handleFilter = () => {
    let data = [...courses];

    if (searchText) {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filterInstructor) {
      data = data.filter((c) => c.instructor === filterInstructor);
    }

    if (filterStatus) {
      data = data.filter((c) => c.status === filterStatus);
    }

    setFiltered(data);
  };

  // ➕ ADD / EDIT
  const openModal = (course?: Course) => {
    setEditingCourse(course || null);
    setIsModalOpen(true);

    if (course) {
      form.setFieldsValue(course);
    } else {
      form.resetFields();
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // ❗ Check trùng tên
      const isDuplicate = courses.some(
        (c) =>
          c.name === values.name &&
          (!editingCourse || c.id !== editingCourse.id)
      );

      if (isDuplicate) {
        message.error("Tên khóa học đã tồn tại!");
        return;
      }

      let newCourses: Course[];

      if (editingCourse) {
        newCourses = courses.map((c) =>
          c.id === editingCourse.id ? { ...c, ...values } : c
        );
        message.success("Cập nhật thành công!");
      } else {
        const newCourse: Course = {
          id: getNextId(),
          ...values,
        };
        newCourses = [...courses, newCourse];
        message.success("Thêm thành công!");
      }

      setCourses(newCourses);
      setFiltered(newCourses);
      setIsModalOpen(false);
    });
  };

  // ❌ DELETE
  const handleDelete = (id: number) => {
    const course = courses.find((c) => c.id === id);

    if (course && course.students > 0) {
      message.error("Không thể xóa khóa học đã có học viên!");
      return;
    }

    const newCourses = courses
      .filter((c) => c.id !== id)
      .map((c, index) => ({
        ...c,
        id: index + 1, // reset lại ID
      }));

    setCourses(newCourses);
    setFiltered(newCourses);
    message.success("Xóa thành công!");
  };

  // 📊 TABLE
  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên khóa học", dataIndex: "name" },
    { title: "Giảng viên", dataIndex: "instructor" },
    {
      title: "Số học viên",
      dataIndex: "students",
      sorter: (a: Course, b: Course) => a.students - b.students,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: CourseStatus) => {
      switch (s) {
        case "OPEN":
          return <Tag color="green">Đang mở</Tag>;
        case "CLOSED":
          return <Tag color="red">Đã kết thúc</Tag>;
        case "PAUSED":
          return <Tag color="orange">Tạm dừng</Tag>;
        default:
          return <Tag>Không xác định</Tag>;
      }
    }
    },
    {
      title: "Hành động",
      render: (_: any, record: Course) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý khóa học</h2>

      {/* 🔍 SEARCH + FILTER */}
      <div style={{ marginBottom: 16, display: "flex", gap: 10 }}>
        <Search
          placeholder="Tìm kiếm khóa học"
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleFilter}
          allowClear
        />

        <Select
          placeholder="Chọn giảng viên"
          allowClear
          style={{ width: 200 }}
          onChange={setFilterInstructor}
        >
          {instructors.map((i) => (
            <Option key={i} value={i}>
              {i}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Chọn trạng thái"
          allowClear
          style={{ width: 200 }}
          onChange={setFilterStatus}
        >
          <Option value="OPEN">Đang mở</Option>
          <Option value="CLOSED">Đã kết thúc</Option>
          <Option value="PAUSED">Tạm dừng</Option>
        </Select>

        <Button type="primary" onClick={handleFilter}>
          Lọc
        </Button>

        <Button type="primary" onClick={() => openModal()}>
          Thêm khóa học
        </Button>
      </div>

      {/* 📊 TABLE */}
      <Table
  rowKey="id"
  columns={columns}
  dataSource={filtered}
  pagination={{
    pageSize: 5, // số item mỗi trang
    showSizeChanger: true, // cho chọn 5,10,20...
    pageSizeOptions: ["5", "10", "20"],
    showTotal: (total) => `Tổng ${total} khóa học`,
  }}
/>

      {/* 🧾 MODAL */}
      <Modal
        title={editingCourse ? "Sửa khóa học" : "Thêm khóa học"}
        visible={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên khóa học"
            rules={[
              { required: true, message: "Không được để trống" },
              { max: 100, message: "Tối đa 100 ký tự" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="instructor"
            label="Giảng viên"
            rules={[{ required: true, message: "Chọn giảng viên" }]}
          >
            <Select placeholder="Chọn giảng viên">
              {instructors.map((i) => (
                <Option key={i} value={i}>
                  {i}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="students"
            label="Số lượng học viên"
            rules={[{ required: true, message: "Nhập số học viên" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả (HTML)"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="OPEN">Đang mở</Option>
              <Option value="CLOSED">Đã kết thúc</Option>
              <Option value="PAUSED">Tạm dừng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManager;