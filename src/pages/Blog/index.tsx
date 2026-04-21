import { useState } from "react";
import { Row, Col, Input, Pagination, Tag } from "antd";
import { getPosts } from "./services";
import { useDebounce } from "./hooks";
import PostCard from "./components/PostCard";

export default () => {
  const posts = getPosts();

  // 🔥 STATE
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // 🔥 LẤY DANH SÁCH TAG
  const allTags = [...new Set(posts.flatMap((p) => p.tags))];

  // 🔥 FILTER
  const filteredPosts = posts.filter(
    (p) =>
      (!selectedTag || p.tags.includes(selectedTag)) &&
      p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // 🔥 PAGINATION (9 bài/trang)
  const pageSize = 9;
  const start = (page - 1) * pageSize;
  const currentPosts = filteredPosts.slice(start, start + pageSize);

  return (
    <div>
      <h2>Trang chủ Blog</h2>

      {/* 🔍 SEARCH */}
      <Input.Search
        placeholder="Tìm kiếm bài viết..."
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ width: 300, marginBottom: 16 }}
      />

      {/* 🏷 TAG FILTER */}
      <div style={{ marginBottom: 16 }}>
        <b>Lọc theo tag: </b>

        <Tag
          color={!selectedTag ? "blue" : ""}
          onClick={() => {
            setSelectedTag(null);
            setPage(1);
          }}
          style={{ cursor: "pointer" }}
        >
          Tất cả
        </Tag>

        {allTags.map((tag) => (
          <Tag
            key={tag}
            color={selectedTag === tag ? "blue" : ""}
            onClick={() => {
              setSelectedTag(tag);
              setPage(1);
            }}
            style={{ cursor: "pointer" }}
          >
            {tag}
          </Tag>
        ))}
      </div>

      {/* 🧱 CARD LIST */}
      <Row gutter={[16, 16]}>
        {currentPosts.map((post) => (
          <Col span={8} key={post.id}>
            <PostCard post={post} />
          </Col>
        ))}
      </Row>

      {/* 📄 PAGINATION */}
      <Pagination
        current={page}
        pageSize={pageSize}
        total={filteredPosts.length}
        onChange={(p) => setPage(p)}
        style={{ marginTop: 20, textAlign: "center" }}
      />
    </div>
  );
};