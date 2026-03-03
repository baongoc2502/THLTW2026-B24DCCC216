import {
  Button, Modal, Table, Form, Input, Select, DatePicker, Space, Tag
} from 'antd';
import { useMemo, useState } from 'react';

export default function OrderPage({ orders, products, setOrders }: any) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    return orders.filter((o: any) => {
      const matchText =
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status ? o.status === status : true;
      return matchText && matchStatus;
    });
  }, [orders, search, status]);

  const submit = (v: any) => {
    const items = v.products.map((id: number) => {
      const p = products.find((x: any) => x.id === id);
      return { productId: p.id, productName: p.name, quantity: 1, price: p.price };
    });

    const total = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

    setOrders([...orders, {
      id: 'DH' + Date.now(),
      customerName: v.customerName,
      phone: v.phone,
      address: v.address,
      products: items,
      totalAmount: total,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString().slice(0, 10),
    }]);

    setOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Tên KH / Mã đơn" onChange={e => setSearch(e.target.value)} />
        <Select placeholder="Trạng thái" allowClear onChange={v => setStatus(v)} style={{ width: 150 }}>
          <Select.Option value="Chờ xử lý">Chờ xử lý</Select.Option>
          <Select.Option value="Đang giao">Đang giao</Select.Option>
          <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
          <Select.Option value="Đã hủy">Đã hủy</Select.Option>
        </Select>
        <Button type="primary" onClick={() => setOpen(true)}>Tạo đơn</Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={filtered}
        columns={[
          { title: 'Mã', dataIndex: 'id' },
          { title: 'Khách', dataIndex: 'customerName' },
          {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            sorter: (a: any, b: any) => a.totalAmount - b.totalAmount,
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (s: string) => <Tag>{s}</Tag>,
          },
          {
            title: 'Ngày',
            dataIndex: 'createdAt',
            sorter: (a: any, b: any) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          },
        ]}
      />

      <Modal open={open} onCancel={() => setOpen(false)} onOk={form.submit}>
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item name="customerName" label="Tên KH" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="SĐT" rules={[{ required: true, pattern: /^[0-9]{10,11}$/ }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="products" label="Sản phẩm" rules={[{ required: true }]}>
            <Select mode="multiple" options={products.map((p: any) => ({ value: p.id, label: p.name }))} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}