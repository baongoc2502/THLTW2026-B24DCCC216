import React, { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Row,
  Col,
  Space,
  message
} from "antd";

const { Header, Content, Sider } = Layout;

type Difficulty = "Dễ" | "Trung bình" | "Khó" | "Rất khó";

interface Block {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
  credits: number;
}

interface Question {
  id: string;
  subjectId: string;
  blockId: string;
  difficulty: Difficulty;
  content: string;
}

interface Exam {
  id: string;
  subjectId: string;
  questions: Question[];
}

export default function QuestionBankSystem() {
  const [page, setPage] = useState("block");
  const [open, setOpen] = useState(false);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [viewExam, setViewExam] = useState<any>(null);

  const [searchSubject, setSearchSubject] = useState<string>();
  const [searchDifficulty, setSearchDifficulty] = useState<string>();

  const [form] = Form.useForm();

  const onFinish = (values: any) => {

    if (page === "block") {
      setBlocks([
        ...blocks,
        { id: Date.now().toString(), name: values.name }
      ]);
    }

    if (page === "subject") {
      setSubjects([
        ...subjects,
        {
          id: values.id,
          name: values.name,
          credits: values.credits
        }
      ]);
    }

    if (page === "question") {
      setQuestions([
        ...questions,
        {
          id: Date.now().toString(),
          subjectId: values.subjectId,
          blockId: values.blockId,
          difficulty: values.difficulty,
          content: values.content
        }
      ]);
    }

    message.success("Thêm thành công");

    setOpen(false);
    form.resetFields();
  };

  const generateExam = (subjectId: string) => {

    const list = questions.filter(q => q.subjectId === subjectId);

    if (list.length < 3) {
      message.error("Không đủ câu hỏi để tạo đề");
      return;
    }

    const random = [...list].sort(() => 0.5 - Math.random()).slice(0,3);

    setExams([
      ...exams,
      {
        id: Date.now().toString(),
        subjectId,
        questions: random
      }
    ]);

    message.success("Tạo đề thành công");
  };

  const filteredQuestions = questions.filter(q => {

    if (searchSubject && q.subjectId !== searchSubject) return false;
    if (searchDifficulty && q.difficulty !== searchDifficulty) return false;

    return true;
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Sider>
        <Menu
          theme="dark"
          defaultSelectedKeys={["block"]}
          onClick={(e:any)=>setPage(e.key)}
        >
          <Menu.Item key="block">Khối kiến thức</Menu.Item>
          <Menu.Item key="subject">Môn học</Menu.Item>
          <Menu.Item key="question">Câu hỏi</Menu.Item>
          <Menu.Item key="exam">Đề thi</Menu.Item>
        </Menu>
      </Sider>

      <Layout>

        <Header style={{color:"white",fontSize:18}}>
          Hệ thống ngân hàng câu hỏi
        </Header>

        <Content style={{padding:20}}>

          <Card
            title="Quản lý"
            extra={
              page !== "exam" &&
              <Button type="primary" onClick={()=>setOpen(true)}>
                Thêm
              </Button>
            }
          >

            {page==="block" && (
              <Table
                rowKey="id"
                dataSource={blocks}
                columns={[
                  {title:"Tên khối kiến thức",dataIndex:"name"}
                ]}
              />
            )}

            {page==="subject" && (
              <Table
                rowKey="id"
                dataSource={subjects}
                columns={[
                  {title:"Mã môn",dataIndex:"id"},
                  {title:"Tên môn",dataIndex:"name"},
                  {title:"Tín chỉ",dataIndex:"credits"}
                ]}
              />
            )}

            {page==="question" && (
              <>

                <Row gutter={16} style={{marginBottom:16}}>

                  <Col>
                    <Select
                      placeholder="Lọc môn học"
                      style={{width:200}}
                      allowClear
                      onChange={(v)=>setSearchSubject(v)}
                    >
                      {subjects.map(s=>(
                        <Select.Option key={s.id} value={s.id}>
                          {s.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>

                  <Col>
                    <Select
                      placeholder="Độ khó"
                      style={{width:200}}
                      allowClear
                      onChange={(v)=>setSearchDifficulty(v)}
                    >
                      <Select.Option value="Dễ">Dễ</Select.Option>
                      <Select.Option value="Trung bình">Trung bình</Select.Option>
                      <Select.Option value="Khó">Khó</Select.Option>
                      <Select.Option value="Rất khó">Rất khó</Select.Option>
                    </Select>
                  </Col>

                </Row>

                <Table
                  rowKey="id"
                  dataSource={filteredQuestions}
                  columns={[
                    {title:"Nội dung",dataIndex:"content"},
                    {title:"Độ khó",dataIndex:"difficulty"},
                    {
                      title:"Môn học",
                      render:(q:any)=>subjects.find(s=>s.id===q.subjectId)?.name
                    }
                  ]}
                />

              </>
            )}

            {page==="exam" && (

              <Space direction="vertical">

                <Select
                  placeholder="Chọn môn để tạo đề"
                  style={{width:250}}
                  onChange={(v)=>generateExam(v)}
                >
                  {subjects.map(s=>(
                    <Select.Option key={s.id} value={s.id}>
                      {s.name}
                    </Select.Option>
                  ))}
                </Select>

                <Table
                  rowKey="id"
                  dataSource={exams}
                  columns={[
                    {title:"Mã đề",dataIndex:"id"},
                    {
                      title:"Số câu",
                      render:(e:any)=>e.questions.length
                    },
                    {
                      title:"Xem đề",
                      render:(e:any)=>(
                        <Button type="link" onClick={()=>setViewExam(e)}>
                          Xem đề
                        </Button>
                      )
                    }
                  ]}
                />

              </Space>

            )}

          </Card>

        </Content>

      </Layout>

      <Modal
        title="Thêm dữ liệu"
        visible={open}
        onCancel={()=>setOpen(false)}
        footer={null}
      >

        <Form form={form} layout="vertical" onFinish={onFinish}>

          {page==="block" && (
            <Form.Item name="name" label="Tên khối kiến thức" rules={[{required:true}]}>
              <Input/>
            </Form.Item>
          )}

          {page==="subject" && (
            <>
              <Form.Item name="id" label="Mã môn" rules={[{required:true}]}>
                <Input/>
              </Form.Item>

              <Form.Item name="name" label="Tên môn" rules={[{required:true}]}>
                <Input/>
              </Form.Item>

              <Form.Item name="credits" label="Tín chỉ" rules={[{required:true}]}>
                <InputNumber style={{width:"100%"}}/>
              </Form.Item>
            </>
          )}

          {page==="question" && (
            <>
              <Form.Item name="subjectId" label="Môn học" rules={[{required:true}]}>
                <Select>
                  {subjects.map(s=>(
                    <Select.Option key={s.id} value={s.id}>
                      {s.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="blockId" label="Khối kiến thức" rules={[{required:true}]}>
                <Select>
                  {blocks.map(b=>(
                    <Select.Option key={b.id} value={b.id}>
                      {b.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="difficulty" label="Độ khó" rules={[{required:true}]}>
                <Select>
                  <Select.Option value="Dễ">Dễ</Select.Option>
                  <Select.Option value="Trung bình">Trung bình</Select.Option>
                  <Select.Option value="Khó">Khó</Select.Option>
                  <Select.Option value="Rất khó">Rất khó</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item name="content" label="Nội dung câu hỏi" rules={[{required:true}]}>
                <Input.TextArea rows={3}/>
              </Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit" block>
            Lưu
          </Button>

        </Form>

      </Modal>

      <Modal
        title="Chi tiết đề thi"
        visible={!!viewExam}
        onCancel={()=>setViewExam(null)}
        footer={null}
      >
        {viewExam && viewExam.questions.map((q:any,index:number)=>(
          <Card key={q.id} style={{marginBottom:10}}>
            <b>Câu {index+1}:</b> {q.content}
            <br/>
            Độ khó: {q.difficulty}
          </Card>
        ))}
      </Modal>

    </Layout>
  );
}