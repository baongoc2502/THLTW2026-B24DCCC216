import { Post } from "./types";

const KEY = "BLOG_POSTS";
const TAGS_KEY = "BLOG_TAGS";

// 🔥 Lấy danh sách bài viết
export const getPosts = (): Post[] => {
  const data = localStorage.getItem(KEY);

  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Parse lỗi:", e);
      return [];
    }
  }

  // 🔥 Dữ liệu mẫu
  const init: Post[] = [
    {
      id: 1,
      title: "React cơ bản",
      slug: "react-basic",
      summary: "Giới thiệu về React cho người mới, học components, props và state",
      content: "## React\nReact là thư viện JavaScript phổ biến để xây dựng giao diện người dùng.\n\n### Components\nComponents là các khối xây dựng cơ bản của React.",
      thumbnail: "https://picsum.photos/id/0/300/200",
      tags: ["react", "frontend"],
      author: "Lê Hồng Bảo Ngọc",
      status: "published",
      views: 5,
      createdAt: "2026-04-20",
    },
    {
      id: 2,
      title: "JavaScript nâng cao",
      slug: "js-advanced",
      summary: "Closure, Promise, Async/Await trong JavaScript",
      content: "## JS nâng cao\n### Closure\nClosure là hàm có thể truy cập biến từ phạm vi bên ngoài.\n\n### Promise\nPromise giúp xử lý bất đồng bộ dễ dàng hơn.",
      thumbnail: "https://picsum.photos/id/1/300/200",
      tags: ["javascript", "frontend"],
      author: "Lê Hồng Bảo Ngọc",
      status: "published",
      views: 2,
      createdAt: "2026-04-21",
    },
    {
      id: 3,
      title: "CSS Flexbox",
      slug: "css-flexbox",
      summary: "Học layout nhanh với Flexbox - Cách căn chỉnh phần tử linh hoạt",
      content: "## Flexbox\nFlexbox là mô hình layout 1 chiều giúp sắp xếp các phần tử.\n\n### Các thuộc tính chính:\n- display: flex\n- justify-content\n- align-items",
      thumbnail: "https://picsum.photos/id/2/300/200",
      tags: ["css", "frontend"],
      author: "Lê Hồng Bảo Ngọc",
      status: "draft",
      views: 0,
      createdAt: "2026-04-22",
    },
  ];

  localStorage.setItem(KEY, JSON.stringify(init));
  return init;
};

// 🔥 Lưu toàn bộ danh sách
const savePosts = (data: Post[]) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

// 🔥 Thêm bài viết
export const addPost = (post: Post) => {
  const data = getPosts();
  data.push(post);
  savePosts(data);
};

// 🔥 Cập nhật bài viết
export const updatePost = (post: Post) => {
  const data = getPosts().map((p) =>
    p.id === post.id ? post : p
  );
  savePosts(data);
};

// 🔥 Xóa bài viết
export const deletePost = (id: number) => {
  const data = getPosts().filter((p) => p.id !== id);
  savePosts(data);
};

// 🔥 Lấy danh sách thẻ kèm số bài viết
export const getTagsWithCount = () => {
  const posts = getPosts();
  const tagMap = new Map<string, number>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagMap.entries()).map(([name, count]) => ({ name, count }));
};

// 🔥 Thêm thẻ mới (cập nhật vào bài viết có thể dùng, nhưng thẻ chỉ tồn tại qua bài viết)
// Thực tế thẻ được quản lý qua bài viết, không cần lưu riêng