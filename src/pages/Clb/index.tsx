import React, { useState } from 'react';
import { useModel } from 'umi';
import {
  Card, Table, Button, Modal, Form, Input, DatePicker, Switch, Space, Popconfirm, message,
  Tag, Avatar, Select, Radio, Tabs, Typography, Row, Col, Statistic,
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, CloseOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ClbPage: React.FC = () => {
  const {
    clbList, donDangKy, thanhVien,
    addCLB, updateCLB, deleteCLB,
    addDonDangKy, updateDonDangKy, deleteDonDangKy,
    duyetDon, getLichSuByDonId, changeClbForThanhVien, removeThanhVien,
  } = useModel('clb');

  const [clbModalVisible, setClbModalVisible] = useState(false);
  const [editingClb, setEditingClb] = useState<any>(null);
  const [clbForm] = Form.useForm();

  const [donModalVisible, setDonModalVisible] = useState(false);
  const [editingDon, setEditingDon] = useState<any>(null);
  const [donForm] = Form.useForm();

  const [lichSuVisible, setLichSuVisible] = useState(false);
  const [currentDonId, setCurrentDonId] = useState<string | null>(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [selectedTvKeys, setSelectedTvKeys] = useState<React.Key[]>([]);
  const [changeClbModalVisible, setChangeClbModalVisible] = useState(false);
  const [newClbId, setNewClbId] = useState<string>('');

  const totalClb = clbList.length;
  const totalDon = donDangKy.length;
  const pendingDon = donDangKy.filter(d => d.trangThai === 'pending').length;
  const approvedDon = donDangKy.filter(d => d.trangThai === 'approved').length;
  const rejectedDon = donDangKy.filter(d => d.trangThai === 'rejected').length;

  const chartData = clbList.map(clb => {
    const donCuaClb = donDangKy.filter(d => d.clbId === clb.id);
    return {
      name: clb.ten,
      pending: donCuaClb.filter(d => d.trangThai === 'pending').length,
      approved: donCuaClb.filter(d => d.trangThai === 'approved').length,
      rejected: donCuaClb.filter(d => d.trangThai === 'rejected').length,
    };
  }).filter(item => item.pending + item.approved + item.rejected > 0);

  const chartOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['Chờ duyệt', 'Đã duyệt', 'Từ chối'] },
    xAxis: { type: 'category', data: chartData.map(d => d.name), axisLabel: { rotate: 30, interval: 0 } },
    yAxis: { type: 'value', name: 'Số lượng' },
    series: [
      { name: 'Chờ duyệt', type: 'bar', data: chartData.map(d => d.pending), itemStyle: { color: '#faad14' } },
      { name: 'Đã duyệt', type: 'bar', data: chartData.map(d => d.approved), itemStyle: { color: '#52c41a' } },
      { name: 'Từ chối', type: 'bar', data: chartData.map(d => d.rejected), itemStyle: { color: '#f5222d' } },
    ],
  };

  const openClbModal = (record?: any) => {
    setEditingClb(record || null);
    if (record) clbForm.setFieldsValue({ ...record, ngayThanhLap: dayjs(record.ngayThanhLap) });
    else clbForm.resetFields();
    setClbModalVisible(true);
  };
  const handleClbSubmit = () => {
    clbForm.validateFields().then(values => {
      const data = {
        avatar: values.avatar,
        ten: values.ten,
        ngayThanhLap: values.ngayThanhLap.format('YYYY-MM-DD'),
        moTa: values.moTa,
        chuNhiem: values.chuNhiem,
        hoatDong: values.hoatDong,
      };
      if (editingClb) updateCLB(editingClb.id, data);
      else addCLB(data);
      setClbModalVisible(false);
    });
  };

  const openDonModal = (record?: any) => {
    setEditingDon(record || null);
    if (record) donForm.setFieldsValue(record);
    else donForm.resetFields();
    setDonModalVisible(true);
  };
  const handleDonSubmit = () => {
    donForm.validateFields().then(values => {
      const data = {
        hoTen: values.hoTen,
        email: values.email,
        sdt: values.sdt,
        gioiTinh: values.gioiTinh,
        diaChi: values.diaChi,
        soTruong: values.soTruong,
        clbId: values.clbId,
        lyDo: values.lyDo,
      };
      if (editingDon) updateDonDangKy(editingDon.id, data);
      else addDonDangKy(data);
      setDonModalVisible(false);
    });
  };

  const showLichSu = (donId: string) => {
    setCurrentDonId(donId);
    setLichSuVisible(true);
  };

  const handleDuyetDon = (action: 'approved' | 'rejected') => {
    if (selectedRowKeys.length === 0) return message.warning('Chọn ít nhất một đơn');
    if (action === 'rejected') setRejectModalVisible(true);
    else {
      duyetDon(selectedRowKeys as string[], action);
      setSelectedRowKeys([]);
    }
  };
  const confirmReject = () => {
    if (!rejectReason.trim()) return message.error('Vui lòng nhập lý do từ chối');
    duyetDon(selectedRowKeys as string[], 'rejected', rejectReason);
    setRejectModalVisible(false);
    setRejectReason('');
    setSelectedRowKeys([]);
  };

  // Thành viên handlers
  const handleChangeClb = () => {
    if (selectedTvKeys.length === 0) return message.warning('Chọn ít nhất một thành viên');
    setChangeClbModalVisible(true);
  };
  const confirmChangeClb = () => {
    if (!newClbId) return message.warning('Chọn CLB đích');
    changeClbForThanhVien(selectedTvKeys as string[], newClbId);
    setChangeClbModalVisible(false);
    setNewClbId('');
    setSelectedTvKeys([]);
  };

  const clbColumns = [
    { title: 'Ảnh', dataIndex: 'avatar', key: 'avatar', render: (url: string) => <Avatar size={50} src={url} />, width: 80 },
    { title: 'Tên CLB', dataIndex: 'ten', key: 'ten', sorter: (a: any, b: any) => a.ten.localeCompare(b.ten) },
    { title: 'Ngày TL', dataIndex: 'ngayThanhLap', key: 'ngayThanhLap', render: (d: string) => dayjs(d).format('DD/MM/YYYY'), sorter: (a: any, b: any) => dayjs(a.ngayThanhLap).unix() - dayjs(b.ngayThanhLap).unix() },
    { title: 'Mô tả', dataIndex: 'moTa', key: 'moTa', render: (html: string) => <div dangerouslySetInnerHTML={{ __html: html }} />, ellipsis: true },
    { title: 'Chủ nhiệm', dataIndex: 'chuNhiem', key: 'chuNhiem', sorter: (a: any, b: any) => a.chuNhiem.localeCompare(b.chuNhiem) },
    { title: 'Hoạt động', dataIndex: 'hoatDong', key: 'hoatDong', render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'Có' : 'Không'}</Tag>, filters: [{ text: 'Đang hoạt động', value: true }, { text: 'Ngừng hoạt động', value: false }], onFilter: (value: any, record: any) => record.hoatDong === value },
    {
      title: 'Thao tác', key: 'action', render: (_: any, record: any) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openClbModal(record)} />
          <Button icon={<EyeOutlined />} size="small" onClick={() => openDonModal({ clbId: record.id })} />
          <Popconfirm title="Xóa CLB?" onConfirm={() => deleteCLB(record.id)}><Button icon={<DeleteOutlined />} size="small" danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  const donColumns = [
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
    { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
    { title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
    { title: 'Sở trường', dataIndex: 'soTruong', key: 'soTruong' },
    { title: 'CLB', dataIndex: 'clbId', key: 'clbId', render: (id: string) => clbList.find(c => c.id === id)?.ten || '', filters: clbList.map(c => ({ text: c.ten, value: c.id })), onFilter: (value: any, record: any) => record.clbId === value },
    { title: 'Lý do', dataIndex: 'lyDo', key: 'lyDo', ellipsis: true },
    { title: 'Trạng thái', dataIndex: 'trangThai', key: 'trangThai', render: (s: string) => <Tag color={s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'orange'}>{s === 'approved' ? 'Đã duyệt' : s === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}</Tag>, filters: [{ text: 'Chờ duyệt', value: 'pending' }, { text: 'Đã duyệt', value: 'approved' }, { text: 'Từ chối', value: 'rejected' }], onFilter: (value: any, record: any) => record.trangThai === value },
    {
      title: 'Thao tác', key: 'action', render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => showLichSu(record.id)} />
          <Button icon={<EditOutlined />} size="small" onClick={() => openDonModal(record)} />
          <Popconfirm title="Xóa đơn?" onConfirm={() => deleteDonDangKy(record.id)}><Button icon={<DeleteOutlined />} size="small" danger /></Popconfirm>
        </Space>
      ),
    },
  ];

  const tvColumns = [
    { title: 'Họ tên', dataIndex: 'hoTen', key: 'hoTen' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'sdt', key: 'sdt' },
    { title: 'Giới tính', dataIndex: 'gioiTinh', key: 'gioiTinh' },
    { title: 'Địa chỉ', dataIndex: 'diaChi', key: 'diaChi' },
    { title: 'Sở trường', dataIndex: 'soTruong', key: 'soTruong' },
    { title: 'CLB', dataIndex: 'clbId', key: 'clbId', render: (id: string) => clbList.find(c => c.id === id)?.ten || '', filters: clbList.map(c => ({ text: c.ten, value: c.id })), onFilter: (value: any, record: any) => record.clbId === value },
    { title: 'Ngày đăng ký', dataIndex: 'ngayDangKy', key: 'ngayDangKy' },
    {
      title: 'Thao tác', key: 'action', render: (_: any, record: any) => (
        <Popconfirm title="Xóa thành viên?" onConfirm={() => removeThanhVien(record.id)}>
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Câu lạc bộ" key="1">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openClbModal()} style={{ marginBottom: 16 }}>Thêm CLB</Button>
            <Table columns={clbColumns} dataSource={clbList} rowKey="id" />
          </TabPane>

          <TabPane tab="Đơn đăng ký" key="2">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => openDonModal()}>Thêm đơn</Button>
              <Button icon={<CheckOutlined />} onClick={() => handleDuyetDon('approved')} disabled={selectedRowKeys.length === 0}>Duyệt ({selectedRowKeys.length})</Button>
              <Button icon={<CloseOutlined />} onClick={() => handleDuyetDon('rejected')} disabled={selectedRowKeys.length === 0}>Từ chối ({selectedRowKeys.length})</Button>
            </Space>
            <Table
            rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
                getCheckboxProps: (record) => ({
                disabled: record.trangThai !== 'pending',
                title: record.trangThai !== 'pending' ? 'Chỉ có thể thao tác trên đơn chờ duyệt' : '',
                }),
            }}
            columns={donColumns}
            dataSource={donDangKy}
            rowKey="id"
            />
          </TabPane>

          <TabPane tab="Thành viên CLB" key="3">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<SwapOutlined />} onClick={handleChangeClb} disabled={selectedTvKeys.length === 0}>Chuyển CLB ({selectedTvKeys.length})</Button>
            </Space>
            <Table
              rowSelection={{ selectedRowKeys: selectedTvKeys, onChange: setSelectedTvKeys }}
              columns={tvColumns}
              dataSource={thanhVien}
              rowKey="id"
            />
          </TabPane>

          <TabPane tab="Thống kê & Báo cáo" key="4">
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}><Statistic title="Tổng số CLB" value={totalClb} /></Col>
              <Col span={6}><Statistic title="Tổng đơn đăng ký" value={totalDon} /></Col>
              <Col span={6}><Statistic title="Chờ duyệt" value={pendingDon} valueStyle={{ color: '#faad14' }} /></Col>
              <Col span={6}><Statistic title="Đã duyệt" value={approvedDon} valueStyle={{ color: '#52c41a' }} /></Col>
              <Col span={6}><Statistic title="Từ chối" value={rejectedDon} valueStyle={{ color: '#f5222d' }} /></Col>
            </Row>
            <Card title="Biểu đồ số lượng đơn đăng ký theo CLB và trạng thái">
              {chartData.length > 0 ? (
                <ReactECharts option={chartOption} style={{ height: 400 }} />
              ) : (
                <div style={{ textAlign: 'center', padding: 50 }}>Chưa có dữ liệu đơn đăng ký</div>
              )}
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      <Modal title={editingClb ? 'Sửa CLB' : 'Thêm CLB'} visible={clbModalVisible} onCancel={() => setClbModalVisible(false)} onOk={handleClbSubmit} width={800}>
        <Form form={clbForm} layout="vertical">
          <Form.Item name="avatar" label="URL ảnh đại diện" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ten" label="Tên CLB" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ngayThanhLap" label="Ngày thành lập" rules={[{ required: true }]}><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="moTa" label="Mô tả" rules={[{ required: true }]}><ReactQuill theme="snow" /></Form.Item>
          <Form.Item name="chuNhiem" label="Chủ nhiệm CLB" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="hoatDong" label="Hoạt động" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>

      <Modal title={editingDon ? 'Sửa đơn' : 'Thêm đơn đăng ký'} visible={donModalVisible} onCancel={() => setDonModalVisible(false)} onOk={handleDonSubmit} width={600}>
        <Form form={donForm} layout="vertical">
          <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Form.Item name="sdt" label="SĐT" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="gioiTinh" label="Giới tính" rules={[{ required: true }]}><Radio.Group><Radio value="Nam">Nam</Radio><Radio value="Nữ">Nữ</Radio></Radio.Group></Form.Item>
          <Form.Item name="diaChi" label="Địa chỉ"><Input /></Form.Item>
          <Form.Item name="soTruong" label="Sở trường"><Input /></Form.Item>
          <Form.Item name="clbId" label="Câu lạc bộ" rules={[{ required: true }]}><Select>{clbList.map(c => <Option key={c.id} value={c.id}>{c.ten}</Option>)}</Select></Form.Item>
          <Form.Item name="lyDo" label="Lý do đăng ký" rules={[{ required: true }]}><TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="Lịch sử thao tác" visible={lichSuVisible} onCancel={() => setLichSuVisible(false)} footer={null} width={600}>
        <Table dataSource={currentDonId ? getLichSuByDonId(currentDonId) : []} rowKey="id" columns={[
          { title: 'Hành động', dataIndex: 'hanhDong', render: (v: string) => v === 'approved' ? 'Duyệt' : 'Từ chối' },
          { title: 'Người thực hiện', dataIndex: 'nguoiThucHien' },
          { title: 'Thời gian', dataIndex: 'thoiGian', render: (ts: number) => dayjs(ts).format('DD/MM/YYYY HH:mm:ss') },
          { title: 'Lý do', dataIndex: 'lyDo' },
        ]} pagination={false} />
      </Modal>

      <Modal title="Từ chối đơn đăng ký" visible={rejectModalVisible} onCancel={() => setRejectModalVisible(false)} onOk={confirmReject}>
        <TextArea rows={3} placeholder="Lý do từ chối (bắt buộc)" value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
      </Modal>

      <Modal title="Chuyển câu lạc bộ" visible={changeClbModalVisible} onCancel={() => setChangeClbModalVisible(false)} onOk={confirmChangeClb}>
        <Select placeholder="Chọn CLB muốn chuyển đến" style={{ width: '100%' }} onChange={setNewClbId}>
          {clbList.map(c => <Option key={c.id} value={c.id}>{c.ten}</Option>)}
        </Select>
      </Modal>
    </div>
  );
};

export default ClbPage;