import { Table, Input, Select, Tag, Space } from 'antd';
import { useMemo, useState } from 'react';

export default function ProductPage({ products }: any) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const getStatusText = (q: number) =>
    q === 0 ? 'Hết hàng' : q <= 10 ? 'Sắp hết' : 'Còn hàng';

  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      const matchName = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCate = category ? p.category === category : true;
      const matchStatus = status ? getStatusText(p.quantity) === status : true;
      return matchName && matchCate && matchStatus;
    });
  }, [products, search, category, status]);

  const columns = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1 },
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      render: (_: any, r: any) => {
        const s = getStatusText(r.quantity);
        return (
          <Tag color={s === 'Còn hàng' ? 'green' : s === 'Sắp hết' ? 'orange' : 'red'}>
            {s}
          </Tag>
        );
      },
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Tìm theo tên" onChange={e => setSearch(e.target.value)} />
        <Select placeholder="Danh mục" allowClear onChange={v => setCategory(v)} style={{ width: 150 }}>
          <Select.Option value="Laptop">Laptop</Select.Option>
          <Select.Option value="Điện thoại">Điện thoại</Select.Option>
          <Select.Option value="Máy tính bảng">Máy tính bảng</Select.Option>
          <Select.Option value="Phụ kiện">Phụ kiện</Select.Option>
        </Select>
        <Select placeholder="Trạng thái" allowClear onChange={v => setStatus(v)} style={{ width: 150 }}>
          <Select.Option value="Còn hàng">Còn hàng</Select.Option>
          <Select.Option value="Sắp hết">Sắp hết</Select.Option>
          <Select.Option value="Hết hàng">Hết hàng</Select.Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </>
  );
}