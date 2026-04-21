import { Card, Avatar, Typography, Row, Col, Tag, Space, Button } from "antd";
import {
  GithubOutlined,
  FacebookOutlined,
  UserOutlined,
  MailOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default () => {
  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#f0f2f5" }}>
      <Card
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Row gutter={32} align="middle">
          <Col span={8} style={{ textAlign: "center" }}>
            <Avatar
              size={140}
              src="https://i.pravatar.cc/300?img=7"
              icon={<UserOutlined />}
              style={{ marginBottom: 16, border: "3px solid #1890ff" }}
            />

            <Title level={3} style={{ marginBottom: 0 }}>
              Lê Hồng Bảo Ngọc
            </Title>

            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
              🇻🇳 Frontend Developer
            </Paragraph>

            <Space size="middle">
              <Button
                type="text"
                icon={<FacebookOutlined />}
                href="#"
                target="_blank"
              />
              <Button
                type="text"
                icon={<GithubOutlined />}
                href="#"
                target="_blank"
              />
              <Button
                type="text"
                icon={<LinkedinOutlined />}
                href="#"
                target="_blank"
              />
              <Button
                type="text"
                icon={<MailOutlined />}
                href="mailto:ngoc@example.com"
              />
            </Space>
          </Col>

          <Col span={16}>
            <Title level={4}> Giới thiệu</Title>
            <Paragraph>
              Xin chào! Mình là Ngọc, một nhà phát triển web đam mê công nghệ.
              Mình yêu thích việc xây dựng các ứng dụng web đẹp mắt và hiệu năng cao.
              Hiện tại mình đang tập trung vào hệ sinh thái React và TypeScript.
            </Paragraph>

            <Title level={4}> Học vấn</Title>
            <Paragraph>
              • Sinh viên Công nghệ thông tin - Đại học Công nghệ<br />
              • Chuyên ngành: Kỹ thuật phần mềm<br />
              • GPA: 3.6/4.0
            </Paragraph>

            <Title level={4}> Kỹ năng chuyên môn</Title>
            <Space wrap size={[8, 16]}>
              <Tag color="blue">React</Tag>
              <Tag color="cyan">TypeScript</Tag>
              <Tag color="geekblue">Node.js</Tag>
              <Tag color="green">Next.js</Tag>
              <Tag color="purple">Ant Design</Tag>
              <Tag color="orange">Tailwind CSS</Tag>
              <Tag color="red">Git</Tag>
              <Tag color="gold">Java</Tag>
            </Space>

            <Title level={4} style={{ marginTop: 16 }}>
               Mục tiêu
            </Title>
            <Paragraph>
              Trở thành Full-stack Developer chuyên nghiệp, đóng góp vào các dự án
              công nghệ lớn và chia sẻ kiến thức với cộng đồng.
            </Paragraph>

            <Title level={4}> Blog này</Title>
            <Paragraph>
              Blog được xây dựng bằng React, UmiJS và Ant Design. Nơi mình chia sẻ
              kiến thức về lập trình và trải nghiệm học tập.
            </Paragraph>
          </Col>
        </Row>
      </Card>
    </div>
  );
};