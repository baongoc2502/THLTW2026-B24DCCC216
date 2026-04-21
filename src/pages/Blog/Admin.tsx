import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Select,
  Tag,
  Space,
  Card,
  message,
} from "antd";
import { PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";

import { getPosts, deletePost, addPost, updatePost } from "./services";
import PostForm from "./components/PostForm";
import { Post } from "./types";

export default () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadPosts = () => {
    setPosts(getPosts());
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const refresh = () => {
    loadPosts();
    message.success("Đã cập nhật danh sách");
  };

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (!status || p.status === status)
  );

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      render: (text: string, record: Post) => <b>{text}</b>,
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) =>
        s === "published" ? (
          <Tag color="green">Đã đăng</Tag>
        ) : (
          <Tag color="orange">Nháp</Tag>
        ),
    },
    {
      title: "Thẻ",
      dataIndex: "tags",
      render: (tags: string[]) =>
        tags.map((t) => (
          <Tag color="blue" key={t}>
            {t}
          </Tag>
        )),
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      sorter: (a: Post, b: Post) => a.views - b.views,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      sorter: (a: Post, b: Post) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: "Hành động",
      fixed: "right" as const,
      width: 150,
      render: (record: Post) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              setVisible(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa bài viết?"
            description={`Bạn có chắc muốn xóa "${record.title}"?`}
            onConfirm={() => {
              deletePost(record.id);
              refresh();
            }}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title=" Quản lý bài viết"
      extra={
        <Button icon={<ReloadOutlined />} onClick={refresh}>
          Làm mới
        </Button>
      }
      style={{ margin: 20, borderRadius: 12 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />

          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 150 }}
            onChange={(v) => setStatus(v || "")}
          >
            <Select.Option value="published">Đã đăng</Select.Option>
            <Select.Option value="draft">Nháp</Select.Option>
          </Select>
        </Space>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditing(null);
            setVisible(true);
          }}
        >
          Thêm bài viết
        </Button>
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} bài` }}
        bordered
        scroll={{ x: 800 }}
      />

      <PostForm
        visible={visible}
        initial={editing}
        onCancel={() => {
          setVisible(false);
          setEditing(null);
        }}
        onOk={(values: any) => {
          if (editing) {
            updatePost({ ...editing, ...values });
            message.success("Đã cập nhật bài viết");
          } else {
            addPost({
              ...values,
              id: Date.now(),
              views: 0,
              createdAt: new Date().toISOString().split("T")[0],
            });
            message.success("Đã thêm bài viết mới");
          }
          refresh();
          setVisible(false);
          setEditing(null);
        }}
      />
    </Card>
  );
};