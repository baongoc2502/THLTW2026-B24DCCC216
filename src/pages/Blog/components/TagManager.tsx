import { useState, useEffect } from "react";
import { Table, Tag, Input, Button, Space, Modal, Form, message, Popconfirm, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  views: number;
  createdAt: string;
}

const getPosts = (): Post[] => {
  const data = localStorage.getItem("BLOG_POSTS");
  if (data) {
    return JSON.parse(data);
  }
  return [];
};

const savePosts = (posts: Post[]) => {
  localStorage.setItem("BLOG_POSTS", JSON.stringify(posts));
};

export default () => {
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const [visible, setVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  const loadTags = () => {
    const allPosts = getPosts();
    setPosts(allPosts);
    
    const tagMap = new Map<string, number>();
    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    
    const tagList = Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
    setTags(tagList);
  };

  useEffect(() => {
    loadTags();
  }, []);

  const handleAddTag = () => {
    if (!newTagName.trim()) {
      message.warning("Vui lòng nhập tên thẻ");
      return;
    }
    if (tags.some(t => t.name === newTagName.trim())) {
      message.warning("Thẻ đã tồn tại");
      return;
    }
    // Thêm thẻ mới (chỉ cần thêm vào state, không lưu vào localStorage vì thẻ sẽ được lưu khi dùng trong bài viết)
    setTags([...tags, { name: newTagName.trim(), count: 0 }]);
    setNewTagName("");
    setVisible(false);
    message.success("Đã thêm thẻ mới");
  };

  const handleEditTag = (oldName: string, newName: string) => {
    if (!newName.trim()) {
      message.warning("Vui lòng nhập tên thẻ mới");
      return;
    }
    if (oldName === newName.trim()) {
      setVisible(false);
      return;
    }
    
    // Cập nhật tên thẻ trong tất cả bài viết
    const updatedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.map(t => t === oldName ? newName.trim() : t)
    }));
    savePosts(updatedPosts);
    loadTags();
    setVisible(false);
    message.success("Đã cập nhật thẻ");
  };

  const handleDeleteTag = (tagName: string) => {
    // Xóa thẻ khỏi tất cả bài viết
    const updatedPosts = posts.map(post => ({
      ...post,
      tags: post.tags.filter(t => t !== tagName)
    }));
    savePosts(updatedPosts);
    loadTags();
    message.success("Đã xóa thẻ");
  };

  const columns = [
    {
      title: "Tên thẻ",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Số bài viết",
      dataIndex: "count",
      key: "count",
      render: (count: number) => <b>{count}</b>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: { name: string; count: number }) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingTag(record.name);
              setNewTagName(record.name);
              setVisible(true);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title={`Xóa thẻ "${record.name}"?`}
            description="Thẻ sẽ bị xóa khỏi tất cả bài viết"
            onConfirm={() => handleDeleteTag(record.name)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="link" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="🏷 Quản lý thẻ"
      style={{ margin: 20, borderRadius: 12 }}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingTag(null);
            setNewTagName("");
            setVisible(true);
          }}
        >
          Thêm thẻ mới
        </Button>
      }
    >
      <Table
        dataSource={tags}
        columns={columns}
        rowKey="name"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title={editingTag ? "Sửa thẻ" : "Thêm thẻ mới"}
        visible={visible}
        onOk={editingTag ? () => handleEditTag(editingTag, newTagName) : handleAddTag}
        onCancel={() => setVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Tên thẻ" required>
            <Input
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Nhập tên thẻ"
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};