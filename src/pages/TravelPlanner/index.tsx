import React, { useState, useMemo } from 'react';
import {
  Tabs, Card, Button, Modal, Form, Input, Select, InputNumber, Rate, DatePicker,
  message, Table, Space, Popconfirm, Row, Col, Slider, Tag, Typography, Progress,
  Alert, Upload, List, Statistic, Badge, Collapse
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UploadOutlined,
  WarningOutlined, DollarOutlined, CalendarOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import useTravelData from './hooks/useTravelData';
import DestinationCard from './components/DestinationCard';
import { Destination, TripDay, Itinerary } from './types';
import dayjs, { Dayjs } from 'dayjs';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const TravelPlanner: React.FC = () => {
  const { destinations, itineraries, addDestination, updateDestination, deleteDestination, addItinerary, updateItinerary, deleteItinerary } = useTravelData();

  const [destModalVisible, setDestModalVisible] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [destForm] = Form.useForm();
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);

  const [itinModalVisible, setItinModalVisible] = useState(false);
  const [editingItin, setEditingItin] = useState<Itinerary | null>(null);
  const [itinForm] = Form.useForm();
  const [days, setDays] = useState<TripDay[]>([{ id: '1', day: 1, destinations: [] }]);

  const [budgetDetailVisible, setBudgetDetailVisible] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);
  const [expectedBudget, setExpectedBudget] = useState<number>(0);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [minRating, setMinRating] = useState(0);

  const filteredDestinations = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    const matchPrice = d.price >= priceRange[0] && d.price <= priceRange[1];
    const matchRating = d.rating >= minRating;
    return matchSearch && matchType && matchPrice && matchRating;
  });

  const calculateTotals = (dests: Destination[]) => {
    return dests.reduce(
      (acc, d) => ({
        food: acc.food + d.foodCost,
        accommodation: acc.accommodation + d.accommodationCost,
        transport: acc.transport + d.transportCost,
        visit: acc.visit + d.price,
        total: acc.total + d.price + d.foodCost + d.accommodationCost + d.transportCost,
      }),
      { food: 0, accommodation: 0, transport: 0, visit: 0, total: 0 }
    );
  };

  const getBudgetBreakdown = (itin: Itinerary) => {
    const totals = { food: 0, accommodation: 0, transport: 0, visit: 0, total: 0 };
    itin.days.forEach(day => {
      const dayTotals = calculateTotals(day.destinations);
      totals.food += dayTotals.food;
      totals.accommodation += dayTotals.accommodation;
      totals.transport += dayTotals.transport;
      totals.visit += dayTotals.visit;
      totals.total += dayTotals.total;
    });
    return totals;
  };

  const handleImageUpload: UploadProps['onChange'] = ({ fileList }) => {
    setImageFileList(fileList);
    if (fileList[0]?.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        destForm.setFieldsValue({ image: e.target?.result as string });
      };
      reader.readAsDataURL(fileList[0].originFileObj);
    }
  };

  const handleDestSubmit = (values: any) => {
    const data = {
      ...values,
      rating: Number(values.rating),
      price: Number(values.price),
      visitDuration: Number(values.visitDuration),
      foodCost: Number(values.foodCost),
      accommodationCost: Number(values.accommodationCost),
      transportCost: Number(values.transportCost),
      image: values.image || 'https://picsum.photos/300/200',
    };
    if (editingDest) {
      updateDestination(editingDest.id, data);
      message.success('Cập nhật điểm đến thành công');
    } else {
      addDestination(data);
      message.success('Thêm điểm đến thành công');
    }
    setDestModalVisible(false);
    setEditingDest(null);
    destForm.resetFields();
    setImageFileList([]);
  };

  const handleItinSubmit = (values: any) => {
    const [start, end] = values.dateRange;
    const totalBudget = days.reduce((sum, day) => 
      sum + day.destinations.reduce((s, d) => s + d.price + d.foodCost + d.accommodationCost + d.transportCost, 0), 0);
    
    const newItin = {
      name: values.name,
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
      days,
      totalBudget,
    };
    
    if (editingItin) {
      updateItinerary(editingItin.id, newItin);
      message.success('Cập nhật lịch trình thành công');
    } else {
      addItinerary(newItin);
      message.success('Thêm lịch trình thành công');
    }
    setItinModalVisible(false);
    setEditingItin(null);
    itinForm.resetFields();
    setDays([{ id: '1', day: 1, destinations: [] }]);
  };

  const openEditItinerary = (itin: Itinerary) => {
    setEditingItin(itin);
    setDays(itin.days.map(d => ({ ...d, id: d.id || Date.now().toString() })));
    itinForm.setFieldsValue({
      name: itin.name,
      dateRange: [dayjs(itin.startDate), dayjs(itin.endDate)],
    });
    setItinModalVisible(true);
  };

  const addDay = () => {
    setDays([...days, { id: Date.now().toString(), day: days.length + 1, destinations: [] }]);
  };

  const addDestinationToDay = (dayId: string, dest: Destination) => {
    setDays(days.map(day => day.id === dayId ? { ...day, destinations: [...day.destinations, dest] } : day));
  };

  const removeDestinationFromDay = (dayId: string, destId: string) => {
    setDays(days.map(day => day.id === dayId ? { ...day, destinations: day.destinations.filter(d => d.id !== destId) } : day));
  };

  const getTravelTime = (day: TripDay) => {
    if (day.destinations.length <= 1) return 0;
    return (day.destinations.length - 1) * 0.5; // giờ
  };

  const adminStats = useMemo(() => {
    const monthCount: Record<string, number> = {};
    itineraries.forEach(itin => {
      const month = dayjs(itin.createdAt || itin.startDate).format('YYYY-MM');
      monthCount[month] = (monthCount[month] || 0) + 1;
    });
    const monthlyData = Object.entries(monthCount).map(([month, count]) => ({ month, count }));

    const destCount: Record<string, number> = {};
    itineraries.forEach(itin => {
      itin.days.forEach(day => {
        day.destinations.forEach(dest => {
          destCount[dest.name] = (destCount[dest.name] || 0) + 1;
        });
      });
    });
    const topDestinations = Object.entries(destCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const totalRevenue = itineraries.reduce((sum, itin) => sum + itin.totalBudget, 0);

    let totalFood = 0, totalAccom = 0, totalTrans = 0, totalVisit = 0;
    itineraries.forEach(itin => {
      itin.days.forEach(day => {
        day.destinations.forEach(dest => {
          totalFood += dest.foodCost;
          totalAccom += dest.accommodationCost;
          totalTrans += dest.transportCost;
          totalVisit += dest.price;
        });
      });
    });

    return { monthlyData, topDestinations, totalRevenue, totalFood, totalAccom, totalTrans, totalVisit };
  }, [itineraries]);

  const destColumns = [
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Địa điểm', dataIndex: 'location' },
    { title: 'Loại', dataIndex: 'type' },
    { title: 'Đánh giá', render: (_: any, r: Destination) => <Rate disabled defaultValue={r.rating} /> },
    { title: 'Giá (VND)', render: (_: any, r: Destination) => r.price.toLocaleString() },
    {
      title: 'Thao tác',
      render: (_: any, r: Destination) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => { setEditingDest(r); destForm.setFieldsValue(r); setDestModalVisible(true); }} />
          <Popconfirm title="Xóa?" onConfirm={() => { deleteDestination(r.id); message.success('Đã xóa'); }}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itinColumns = [
    { title: 'Tên lịch trình', dataIndex: 'name' },
    { title: 'Ngày bắt đầu', dataIndex: 'startDate' },
    { title: 'Ngày kết thúc', dataIndex: 'endDate' },
    { title: 'Tổng ngân sách', render: (_: any, r: Itinerary) => r.totalBudget.toLocaleString() + ' VND' },
    {
      title: 'Thao tác',
      render: (_: any, r: Itinerary) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEditItinerary(r)}>Sửa</Button>
          <Popconfirm title="Xóa lịch trình?" onConfirm={() => deleteItinerary(r.id)}>
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh', padding: 24 }}>
      <Card style={{ overflow: 'auto' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Lập kế hoạch du lịch</Title>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Khám phá điểm đến" key="1">
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle" style={{marginBottom: 16}}>
                <Col xs={24} sm={8}><Input.Search placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)} /></Col>
                <Col xs={24} sm={6}><Select value={typeFilter} onChange={setTypeFilter} style={{ width: '100%' }}><Option value="all">Tất cả</Option><Option value="biển">Biển</Option><Option value="núi">Núi</Option><Option value="thành phố">Thành phố</Option></Select></Col>
                <Col xs={24} sm={5}><Rate value={minRating} onChange={setMinRating} /></Col>
                <Col xs={24} sm={5}><Slider range min={0} max={1000000} step={50000} value={priceRange} onChange={(v) => setPriceRange(v as [number, number])} /></Col>
              </Row>
                <Row gutter={[16, 16]}>
                {filteredDestinations.map(dest => (
                    <Col xs={24} sm={12} md={8} lg={6} key={dest.id} style={{ display: 'flex' }}>
                    <DestinationCard destination={dest} />
                    </Col>
                ))}
                </Row>
            </Card>
          </TabPane>

          <TabPane tab="Tạo lịch trình" key="2">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingItin(null); itinForm.resetFields(); setDays([{ id: '1', day: 1, destinations: [] }]); setItinModalVisible(true); }}>Tạo lịch trình mới</Button>
            <Table dataSource={itineraries} columns={itinColumns} rowKey="id" style={{ marginTop: 16 }} pagination={{ pageSize: 5 }} />
          </TabPane>

          <TabPane tab="Quản lý ngân sách" key="3">
            <Table
              dataSource={itineraries}
              columns={[
                { title: 'Lịch trình', dataIndex: 'name' },
                { title: 'Tổng chi', render: (_: any, r: Itinerary) => r.totalBudget.toLocaleString() + ' VND' },
                { title: 'Chi tiết', render: (_: any, r: Itinerary) => <Button icon={<EyeOutlined />} onClick={() => { setSelectedItinerary(r); setExpectedBudget(r.totalBudget); setBudgetDetailVisible(true); }}>Xem</Button> }
              ]}
              rowKey="id"
            />
          </TabPane>

          <TabPane tab="Quản trị" key="4">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingDest(null); destForm.resetFields(); setImageFileList([]); setDestModalVisible(true); }}>Thêm điểm đến</Button>
            <Table dataSource={destinations} columns={destColumns} rowKey="id" style={{ marginTop: 16 }} pagination={{ pageSize: 5 }} />
            
            <Title level={4} style={{ marginTop: 24 }}>Thống kê nâng cao</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="Lịch trình theo tháng" bordered={false}>
                  {adminStats.monthlyData.length > 0 ? adminStats.monthlyData.map(item => (
                    <div key={item.month} style={{ marginBottom: 8 }}>
                      <Text strong>{item.month}</Text>
                      <Progress percent={(item.count / Math.max(...adminStats.monthlyData.map(d => d.count), 1)) * 100} format={() => `${item.count} lịch trình`} />
                    </div>
                  )) : <Text>Chưa có dữ liệu</Text>}
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Địa điểm phổ biến nhất" bordered={false}>
                  <List
                    dataSource={adminStats.topDestinations}
                    renderItem={([name, count]) => (
                      <List.Item>
                        <Text strong>{name}</Text> <Badge count={count} showZero color="blue" />
                      </List.Item>
                    )}
                    locale={{ emptyText: 'Chưa có dữ liệu' }}
                  />
                </Card>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} md={12}>
                <Card title="Tổng doanh thu dự kiến">
                  <Statistic value={adminStats.totalRevenue} suffix="VND" groupSeparator="." />
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Phân bổ chi tiêu (tất cả lịch trình)">
                  {adminStats.totalVisit + adminStats.totalFood + adminStats.totalAccom + adminStats.totalTrans > 0 ? (
                    <>
                      <div style={{ marginBottom: 8 }}>
                        <Progress percent={(adminStats.totalVisit / (adminStats.totalVisit + adminStats.totalFood + adminStats.totalAccom + adminStats.totalTrans) * 100) || 0} success={{ percent: 0 }} format={() => `Tham quan: ${adminStats.totalVisit.toLocaleString()} VND`} />
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Progress percent={(adminStats.totalFood / (adminStats.totalVisit + adminStats.totalFood + adminStats.totalAccom + adminStats.totalTrans) * 100) || 0} status="active" format={() => `Ăn uống: ${adminStats.totalFood.toLocaleString()} VND`} />
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Progress percent={(adminStats.totalAccom / (adminStats.totalVisit + adminStats.totalFood + adminStats.totalAccom + adminStats.totalTrans) * 100) || 0} status="active" format={() => `Lưu trú: ${adminStats.totalAccom.toLocaleString()} VND`} />
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Progress percent={(adminStats.totalTrans / (adminStats.totalVisit + adminStats.totalFood + adminStats.totalAccom + adminStats.totalTrans) * 100) || 0} status="active" format={() => `Di chuyển: ${adminStats.totalTrans.toLocaleString()} VND`} />
                      </div>
                    </>
                  ) : <Text>Chưa có dữ liệu chi tiêu</Text>}
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      <Modal title={editingDest ? 'Sửa điểm đến' : 'Thêm điểm đến'} visible={destModalVisible} onCancel={() => setDestModalVisible(false)} onOk={() => destForm.submit()} width={600}>
        <Form form={destForm} layout="vertical" onFinish={handleDestSubmit}>
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="location" label="Địa điểm"><Input /></Form.Item>
          <Form.Item name="type" label="Loại hình"><Select><Option value="biển">Biển</Option><Option value="núi">Núi</Option><Option value="thành phố">Thành phố</Option></Select></Form.Item>
          <Form.Item name="rating" label="Đánh giá" initialValue={5}><Rate /></Form.Item>
          <Form.Item name="price" label="Chi phí tham quan (VND)"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea /></Form.Item>
          <Form.Item name="visitDuration" label="Thời gian tham quan (giờ)"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="foodCost" label="Chi phí ăn uống (VND/ngày)"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="accommodationCost" label="Chi phí lưu trú (VND/đêm)"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="transportCost" label="Chi phí di chuyển (VND)"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="image" label="URL ảnh" hidden><Input /></Form.Item>
          <Form.Item label="Tải ảnh lên">
            <Upload listType="picture" fileList={imageFileList} onChange={handleImageUpload} beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={editingItin ? 'Sửa lịch trình' : 'Tạo lịch trình mới'} visible={itinModalVisible} onCancel={() => setItinModalVisible(false)} footer={null} width={800}>
        <Form form={itinForm} layout="vertical" onFinish={handleItinSubmit}>
          <Form.Item name="name" label="Tên lịch trình" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="dateRange" label="Khoảng thời gian" rules={[{ required: true }]}><RangePicker style={{ width: '100%' }} /></Form.Item>
          <div><Button type="dashed" onClick={addDay} icon={<PlusOutlined />}>Thêm ngày</Button></div>
          {days.map((day, idx) => (
            <Card key={day.id} title={`Ngày ${day.day}`} style={{ marginTop: 16 }} extra={<Text type="secondary">Di chuyển: {getTravelTime(day)} giờ</Text>}>
              {day.destinations.map(dest => (
                <div key={dest.id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><EnvironmentOutlined /> {dest.name} - {dest.price.toLocaleString()} VND</span>
                  <Button size="small" danger onClick={() => removeDestinationFromDay(day.id, dest.id)}>Xóa</Button>
                </div>
              ))}
              <Select
                placeholder="Chọn điểm đến"
                style={{ width: '100%', marginTop: 8 }}
                onChange={(val) => {
                  const dest = destinations.find(d => d.id === val);
                  if (dest) addDestinationToDay(day.id, dest);
                }}
              >
                {destinations.map(d => <Option key={d.id} value={d.id}>{d.name} - {d.price.toLocaleString()} VND</Option>)}
              </Select>
            </Card>
          ))}
          <Form.Item><Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>Lưu lịch trình</Button></Form.Item>
        </Form>
      </Modal>

    <Modal
    title="Chi tiết ngân sách"
    visible={budgetDetailVisible}
    onCancel={() => setBudgetDetailVisible(false)}
    footer={null}
    width={800}
    style={{ top: 20 }}
    bodyStyle={{ overflowX: 'auto', maxHeight: '70vh', padding: '16px' }}
    >
    {selectedItinerary && (
        <div style={{ minWidth: 280 }}>
        <Title level={4}>{selectedItinerary.name}</Title>
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
            <Statistic title="Tổng chi thực tế" value={selectedItinerary.totalBudget} suffix="VND" groupSeparator="." />
            </Col>
            <Col xs={24} sm={12}>
            <InputNumber
                addonBefore="Ngân sách dự kiến"
                value={expectedBudget}
                onChange={(val) => setExpectedBudget(val || 0)}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%' }}
            />
            </Col>
        </Row>
        {expectedBudget > 0 && selectedItinerary.totalBudget > expectedBudget && (
            <Alert
            message="Cảnh báo vượt ngân sách!"
            description={`Bạn đã chi vượt ${(selectedItinerary.totalBudget - expectedBudget).toLocaleString()} VND so với dự kiến.`}
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            style={{ margin: '16px 0' }}
            />
        )}
        {(() => {
            const breakdown = getBudgetBreakdown(selectedItinerary);
            const total = breakdown.total;
            if (total === 0) return <Text>Chưa có dữ liệu chi tiết.</Text>;
            return (
            <div style={{ marginTop: 16 }}>
                <Title level={5}>Phân bổ chi phí</Title>
                <div style={{ marginBottom: 8 }}>
                <Progress
                    percent={parseFloat(((breakdown.visit / total) * 100).toFixed(1))}
                    format={(percent) => `Tham quan: ${percent}%`}
                />
                <Text type="secondary">{breakdown.visit.toLocaleString()} VND</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                <Progress
                    percent={parseFloat(((breakdown.food / total) * 100).toFixed(1))}
                    format={(percent) => `Ăn uống: ${percent}%`}
                />
                <Text type="secondary">{breakdown.food.toLocaleString()} VND</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                <Progress
                    percent={parseFloat(((breakdown.accommodation / total) * 100).toFixed(1))}
                    format={(percent) => `Lưu trú: ${percent}%`}
                />
                <Text type="secondary">{breakdown.accommodation.toLocaleString()} VND</Text>
                </div>
                <div style={{ marginBottom: 8 }}>
                <Progress
                    percent={parseFloat(((breakdown.transport / total) * 100).toFixed(1))}
                    format={(percent) => `Di chuyển: ${percent}%`}
                />
                <Text type="secondary">{breakdown.transport.toLocaleString()} VND</Text>
                </div>
            </div>
            );
        })()}
        <Collapse style={{ marginTop: 16 }} ghost>
            <Panel header="Xem chi tiết theo ngày" key="1">
            {selectedItinerary.days.map(day => (
                <Card key={day.id} title={`Ngày ${day.day}`} size="small" style={{ marginTop: 8 }}>
                {day.destinations.map(dest => (
                    <div key={dest.id} style={{ marginBottom: 4, wordBreak: 'break-word' }}>
                    <Text strong>{dest.name}</Text>: Ăn uống {dest.foodCost.toLocaleString()} | Lưu trú {dest.accommodationCost.toLocaleString()} | Di chuyển {dest.transportCost.toLocaleString()} | Tham quan {dest.price.toLocaleString()}
                    </div>
                ))}
                <Text type="secondary">Tổng ngày: {calculateTotals(day.destinations).total.toLocaleString()} VND</Text>
                </Card>
            ))}
            </Panel>
        </Collapse>
        </div>
    )}
    </Modal>
    </div>
  );
};

export default TravelPlanner;