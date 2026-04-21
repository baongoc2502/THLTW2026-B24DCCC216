import { Card, Tag } from "antd";
import { history } from "umi";
import { Post } from "../types";

export default ({ post }: { post: Post }) => {
  return (
    <Card
      hoverable
      cover={<img src={post.thumbnail} alt={post.title} style={{ height: 180, objectFit: "cover" }} />}
      onClick={() => history.push(`/post/${post.slug}`)}
    >
      <h3>{post.title}</h3>
      <p style={{ color: "#666", minHeight: 48 }}>{post.summary || post.content.substring(0, 80)}</p>
      <p style={{ color: "#999", fontSize: 12 }}>
        {post.author} - {post.createdAt}
      </p>
      {post.tags.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </Card>
  );
};