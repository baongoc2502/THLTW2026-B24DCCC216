export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;   // ✅ mới
  content: string;
  thumbnail: string;
  tags: string[];
  author: string;    // ✅ mới
  status: "draft" | "published";
  views: number;
  createdAt: string;
}