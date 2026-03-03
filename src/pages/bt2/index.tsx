import { Tabs, Card, Statistic } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { productInit, orderInit } from './data';
import { load, save } from './storage';
import ProductPage from './ProductPages';
import OrderPage from './OrderPages';

export default function BaiTap2() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    setProducts(load('products', productInit));
    setOrders(load('orders', orderInit));
  }, []);

  useEffect(() => save('products', products), [products]);
  useEffect(() => save('orders', orders), [orders]);

  const revenue = useMemo(
    () => orders.filter(o => o.status === 'Hoàn thành')
      .reduce((s, o) => s + o.totalAmount, 0),
    [orders]
  );

  return (
    <Tabs
      items={[
        {
          key: '1',
          label: 'Dashboard',
          children: (
            <div style={{ display: 'flex', gap: 16 }}>
              <Card><Statistic title="Sản phẩm" value={products.length} /></Card>
              <Card><Statistic title="Đơn hàng" value={orders.length} /></Card>
              <Card><Statistic title="Doanh thu" value={revenue} /></Card>
            </div>
          ),
        },
        {
          key: '2',
          label: 'Quản lý Sản phẩm',
          children: <ProductPage products={products} />,
        },
        {
          key: '3',
          label: 'Quản lý Đơn hàng',
          children: <OrderPage orders={orders} products={products} setOrders={setOrders} />,
        },
      ]}
    />
  );
}