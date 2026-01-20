import React, { useState } from 'react';
import { Button, Input, Space, message } from 'antd';
import ProductTable from '@/pages/Components/ProductTable.jsx';
import ProductFormModal from '@/pages/Components/ProductFormModal.jsx';

const initialProducts = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddProduct = (values) => {
    const newProduct = {
      id: Date.now(),
      ...values,
    };
    setProducts([...products, newProduct]);
    message.success('Thêm sản phẩm thành công');
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((item) => item.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div style={{ padding: 24 }}>
      <h2>Quản lý sản phẩm</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên sản phẩm"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <ProductTable
        data={filteredProducts}
        onDelete={handleDeleteProduct}
      />

      <ProductFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
      />
    </div>
  );
};

export default ProductManagement;