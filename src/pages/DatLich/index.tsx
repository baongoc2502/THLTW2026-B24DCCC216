// FULL FINAL VERSION - FIX DATA + LABEL
import React, { useState, useEffect } from "react";
import {
  Layout, Menu, Card, Button, Table, Tag, Space,
  Modal, Form, Input, Select, DatePicker, TimePicker,
  Rate, message, Row, Col, InputNumber
} from "antd";
import { CalendarOutlined, TeamOutlined, BarChartOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

interface Employee {
  id: string;
  name: string;
  max: number;
  work: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Appointment {
  key: string;
  customer: string;
  employee: string;
  service: string;
  date: string;
  start: string;
  end: string;
  status: string;
  rating?: number;
  review?: string;
  reply?: string;
}

const App: React.FC = () => {
  const [page, setPage] = useState("appointments");

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [data, setData] = useState<Appointment[]>([]);

  const [empModal, setEmpModal] = useState(false);
  const [serModal, setSerModal] = useState(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [reviewModal, setReviewModal] = useState<any>(null);
  const [replyModal, setReplyModal] = useState<any>(null);

  const [formEmp] = Form.useForm();
  const [formSer] = Form.useForm();
  const [formBooking] = Form.useForm();

  // ===== INIT DATA =====
  useEffect(() => {
    setEmployees([
      { id: "1", name: "Nguyễn Văn A", max: 5, work: "9-17" },
      { id: "2", name: "Trần Thị B", max: 4, work: "10-18" }
    ]);

    setServices([
      { id: "1", name: "Cắt tóc", duration: 30, price: 100000 },
      { id: "2", name: "Spa", duration: 60, price: 300000 },
      { id: "3", name: "Gội đầu", duration: 20, price: 50000 }
    ]);
  }, []);

  // ===== CRUD =====
  const addEmployee = (v: any) => {
    setEmployees([...employees, { id: Date.now()+"", ...v }]);
    setEmpModal(false);
    formEmp.resetFields();
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const addService = (v: any) => {
    setServices([...services, { id: Date.now()+"", ...v }]);
    setSerModal(false);
    formSer.resetFields();
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  // ===== BOOKING =====
  const isConflict = (date: string, emp: string, start: string, end: string) => {
    return data.some(d => d.date === date && d.employee === emp && !(end <= d.start || start >= d.end));
  };

  const addBooking = (v: any) => {
    const service = services.find(s => s.id === v.service);
    const emp = employees.find(e => e.id === v.employee);

    const date = v.date.format("YYYY-MM-DD");
    const start = v.time.format("HH:mm");
    const end = v.time.clone().add(service?.duration || 0, "minutes").format("HH:mm");

    const [ws, we] = (emp?.work || "9-17").split("-").map(Number);
    const hour = parseInt(start.split(":")[0]);
    if (hour < ws || hour >= we) return message.error("Ngoài giờ!");

    if (isConflict(date, v.employee, start, end)) return message.error("Trùng lịch!");

    const count = data.filter(d => d.date === date && d.employee === v.employee).length;
    if (count >= (emp?.max || 0)) return message.error("Full!");

    setData([...data, {
      key: Date.now()+"",
      customer: v.customer,
      employee: v.employee,
      service: service?.name,
      date, start, end,
      status: "pending"
    }]);

    setBookingModal(false);
    formBooking.resetFields();
  };

  const avgRating = (emp: string) => {
    const list = data.filter(d => d.employee === emp && d.rating);
    if (!list.length) return 0;
    return (list.reduce((a, b) => a + (b.rating || 0), 0) / list.length).toFixed(1);
  };

  const revenue = () => {
    let sum = 0;
    data.forEach(d => {
      if (d.status === "completed") {
        const s = services.find(x => x.name === d.service);
        sum += s?.price || 0;
      }
    });
    return sum;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu theme="dark" mode="inline" onClick={(e)=>setPage(e.key)}>
          <Menu.Item key="appointments" icon={<CalendarOutlined/>}>Lịch</Menu.Item>
          <Menu.Item key="employees" icon={<TeamOutlined/>}>Nhân viên</Menu.Item>
          <Menu.Item key="services" icon={<BarChartOutlined/>}>Dịch vụ</Menu.Item>
          <Menu.Item key="stats" icon={<BarChartOutlined/>}>Thống kê</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{color:"#fff"}}>Booking App</Header>
        <Content style={{margin:20}}>

          {page==="appointments" && (
            <>
              <Button type="primary" onClick={()=>setBookingModal(true)}>Đặt lịch</Button>
              <Table dataSource={data} columns={[
                { title:"Khách", dataIndex:"customer"},
                { title:"NV", render:(r:any)=>employees.find(e=>e.id===r.employee)?.name},
                { title:"DV", dataIndex:"service"},
                { title:"Ngày", dataIndex:"date"},
                { title:"Giờ", render:(r:any)=>`${r.start}-${r.end}`},
                { title:"TT", render:(r:any)=><Tag color={r.status==='pending'?'orange':r.status==='confirmed'?'blue':r.status==='completed'?'green':'red'}>{r.status}</Tag>},
                { title:"", render:(r:any)=>(
                  <Space>
                    <Button onClick={()=>setData(d=>d.map(i=>i.key===r.key?{...i,status:"confirmed"}:i))}>Xác nhận</Button>
                    <Button onClick={()=>setData(d=>d.map(i=>i.key===r.key?{...i,status:"completed"}:i))}>Hoàn thành</Button>
                    <Button danger onClick={()=>setData(d=>d.map(i=>i.key===r.key?{...i,status:"cancel"}:i))}>Hủy</Button>
                    {r.status==="completed" && <Button onClick={()=>setReviewModal(r)}>⭐</Button>}
                    {r.rating && <Button onClick={()=>setReplyModal(r)}>💬</Button>}
                  </Space>
                )}
              ]}/>
            </>
          )}

          {page==="employees" && (
            <Card title="Nhân viên" extra={<Button onClick={()=>setEmpModal(true)}>+ Thêm</Button>}>
              {employees.map(e=>(
                <p key={e.id}>{e.name} | {e.max} | {e.work} <Button danger onClick={()=>deleteEmployee(e.id)}>X</Button></p>
              ))}
            </Card>
          )}

          {page==="services" && (
            <Card title="Dịch vụ" extra={<Button onClick={()=>setSerModal(true)}>+ Thêm</Button>}>
              {services.map(s=>(
                <p key={s.id}>{s.name} | {s.price} <Button danger onClick={()=>deleteService(s.id)}>X</Button></p>
              ))}
            </Card>
          )}

          {page==="stats" && (
            <Row gutter={16}>
              <Col span={12}><Card title="Doanh thu">{revenue()}</Card></Col>
              <Col span={12}><Card title="Rating">
                {employees.map(e=>(<p key={e.id}>{e.name}: {avgRating(e.id)} ⭐</p>))}
              </Card></Col>
            </Row>
          )}

        </Content>
      </Layout>

      {/* MODALS */}
      <Modal visible={empModal} onCancel={()=>setEmpModal(false)} onOk={()=>formEmp.submit()} title="Thêm nhân viên">
        <Form form={formEmp} onFinish={addEmployee}>
          <Form.Item name="name" label="Tên nhân viên" rules={[{required:true}]}><Input/></Form.Item>
          <Form.Item name="max" label="Số khách/ngày" rules={[{required:true}]}><InputNumber/></Form.Item>
          <Form.Item name="work" label="Giờ làm (vd: 9-17)" rules={[{required:true}]}><Input/></Form.Item>
        </Form>
      </Modal>

      <Modal visible={serModal} onCancel={()=>setSerModal(false)} onOk={()=>formSer.submit()} title="Thêm dịch vụ">
        <Form form={formSer} onFinish={addService}>
          <Form.Item name="name" label="Tên dịch vụ" rules={[{required:true}]}><Input/></Form.Item>
          <Form.Item name="duration" label="Thời gian (phút)" rules={[{required:true}]}><InputNumber/></Form.Item>
          <Form.Item name="price" label="Giá" rules={[{required:true}]}><InputNumber/></Form.Item>
        </Form>
      </Modal>

      <Modal visible={bookingModal} onCancel={()=>setBookingModal(false)} onOk={()=>formBooking.submit()} title="Đặt lịch">
        <Form form={formBooking} onFinish={addBooking}>
          <Form.Item name="customer" label="Tên khách hàng" rules={[{required:true}]}><Input/></Form.Item>
          <Form.Item name="employee" label="Nhân viên" rules={[{required:true}]}>
            <Select>{employees.map(e=><Option key={e.id} value={e.id}>{e.name}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="service" label="Dịch vụ" rules={[{required:true}]}>
            <Select>{services.map(s=><Option key={s.id} value={s.id}>{s.name}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{required:true}]}><DatePicker/></Form.Item>
          <Form.Item name="time" label="Giờ" rules={[{required:true}]}><TimePicker/></Form.Item>
        </Form>
      </Modal>

      <Modal visible={!!reviewModal} onCancel={()=>setReviewModal(null)} onOk={()=>{
        setData(d=>d.map(i=>i.key===reviewModal.key?{...i,rating:5}:i));
        setReviewModal(null);
      }} title="Đánh giá"><Rate/></Modal>

      <Modal visible={!!replyModal} onCancel={()=>setReplyModal(null)} onOk={()=>setReplyModal(null)} title="Phản hồi"><Input/></Modal>

    </Layout>
  );
};

export default App;
