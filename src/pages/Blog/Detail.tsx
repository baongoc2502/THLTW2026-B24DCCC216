import { useParams, history } from "umi";
import { Button, Tag, Divider, Card, Row, Col, message } from "antd";
import { getPosts, updatePost } from "./services";
import ReactMarkdown from "react-markdown";
import { useEffect } from "react";

export default () => {
  const { slug } = useParams<{ slug: string }>();

  const posts = getPosts();
  const post = posts.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) {
      const updatedPost = { ...post, views: post.views + 1 };
      updatePost(updatedPost);
    }
  }, [slug]);

  if (!post) {
    message.error("Không tìm thấy bài viết");
    return <div style={{ textAlign: "center", padding: 50 }}>Không tìm thấy bài viết</div>;
  }

  const relatedPosts = posts.filter(
    (p) =>
      p.id !== post.id &&
      p.tags.some((t) => post.tags.includes(t)) &&
      p.status === "published"
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
      <Button onClick={() => history.push("/")} style={{ marginBottom: 20 }}>
        ← Quay lại danh sách
      </Button>

      <Card>
        <h1 style={{ fontSize: 32, marginBottom: 16 }}>{post.title}</h1>

        <div style={{ color: "#666", marginBottom: 16 }}>
          ✍ {post.author} | 📅 {post.createdAt} | 👁 {post.views + 1} lượt xem
        </div>

        <div style={{ marginBottom: 16 }}>
          {post.tags.map((t) => (
            <Tag color="blue" key={t}>
              {t}
            </Tag>
          ))}
        </div>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            style={{ width: "100%", borderRadius: 8, marginBottom: 24 }}
          />
        )}

        <Divider />

        <div style={{ lineHeight: 1.8, fontSize: 16 }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        <Divider />

        <h3> Bài viết liên quan</h3>
        {relatedPosts.length === 0 && (
          <p style={{ color: "#999" }}>Không có bài viết liên quan</p>
        )}

        <Row gutter={[16, 16]}>
          {relatedPosts.slice(0, 3).map((p) => (
            <Col span={8} key={p.id}>
              <Card
                hoverable
                size="small"
                cover={
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    style={{ height: 120, objectFit: "cover" }}
                  />
                }
                onClick={() => history.push(`/post/${p.slug}`)}
              >
                <Card.Meta
                  title={p.title}
                  description={`👁 ${p.views} lượt xem`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};