import React, { useState } from "react";
import {
  Layout,
  Menu,
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Space,
} from "antd";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

interface SoVanBang {
  id: number;
  nam: number;
  soHienTai: number;
}

interface QuyetDinh {
  id: number;
  soQD: string;
  ngay: string;
  trichYeu: string;
  soVanBangId: number;
}

interface FieldConfig {
  id: number;
  name: string;
  type: "string" | "number" | "date";
}

interface VanBang {
  id: number;
  soVaoSo: number;
  soHieu: string;
  msv: string;
  hoTen: string;
  ngaySinh: string;
  quyetDinhId: number;
  dynamicData: any;
}

const App: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState("so");

  const [soList, setSoList] = useState<SoVanBang[]>([]);
  const [qdList, setQdList] = useState<QuyetDinh[]>([]);
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [vanBangs, setVanBangs] = useState<VanBang[]>([]);

  const [searchResult, setSearchResult] = useState<VanBang[]>([]);
  const [qdCount, setQdCount] = useState<{ [key: number]: number }>({});

  /* ================= SỔ ================= */
  const addSo = (values: any) => {
    if (soList.find((s) => s.nam === Number(values.nam))) {
      return message.error("Năm đã tồn tại");
    }

    setSoList([
      ...soList,
      { id: Date.now(), nam: Number(values.nam), soHienTai: 0 },
    ]);
  };

  /* ================= QĐ ================= */
  const addQD = (values: any) => {
    setQdList([
      ...qdList,
      {
        id: Date.now(),
        soQD: values.soQD,
        ngay: values.ngay.format("YYYY-MM-DD"),
        trichYeu: values.trichYeu,
        soVanBangId: values.soVanBangId,
      },
    ]);
  };

  /* ================= FIELD ================= */
  const addField = (values: any) => {
    if (fields.find((f) => f.name === values.name)) {
      return message.error("Field đã tồn tại");
    }

    setFields([
      ...fields,
      { id: Date.now(), name: values.name, type: values.type },
    ]);
  };

  const deleteField = (id: number) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  /* ================= VĂN BẰNG ================= */
  const addVanBang = (values: any) => {
    const so = soList.find((s) => s.id === values.soVanBangId);
    const qd = qdList.find((q) => q.id === values.quyetDinhId);

    if (!so || !qd) return message.error("Thiếu dữ liệu");

    if (qd.soVanBangId !== so.id) {
      return message.error("QĐ không thuộc sổ này");
    }

    const soMoi = so.soHienTai + 1;

    setSoList(
      soList.map((s) =>
        s.id === so.id ? { ...s, soHienTai: soMoi } : s
      )
    );

    const dynamicData: any = {};
    fields.forEach((f) => {
      if (f.type === "date" && values[f.name]) {
        dynamicData[f.name] = values[f.name].format("YYYY-MM-DD");
      } else {
        dynamicData[f.name] = values[f.name];
      }
    });

    setVanBangs([
      ...vanBangs,
      {
        id: Date.now(),
        soVaoSo: soMoi,
        soHieu: values.soHieu,
        msv: values.msv,
        hoTen: values.hoTen,
        ngaySinh: values.ngaySinh.format("YYYY-MM-DD"),
        quyetDinhId: values.quyetDinhId,
        dynamicData,
      },
    ]);
  };

  /* ================= SEARCH ================= */
  const search = (values: any) => {
    const count = Object.values(values).filter((v) => v).length;
    if (count < 2) return message.error("Nhập ít nhất 2 điều kiện");

    const result = vanBangs.filter((vb) => {
      return (
        (!values.soVaoSo || vb.soVaoSo.toString().includes(values.soVaoSo)) &&
        (!values.soHieu || vb.soHieu.includes(values.soHieu)) &&
        (!values.msv || vb.msv.includes(values.msv)) &&
        (!values.hoTen ||
          vb.hoTen.toLowerCase().includes(values.hoTen.toLowerCase()))
      );
    });

    setSearchResult(result);

    const map = { ...qdCount };
    result.forEach((vb) => {
      map[vb.quyetDinhId] = (map[vb.quyetDinhId] || 0) + 1;
    });
    setQdCount(map);
  };

  /* ================= UI ================= */

  const renderSo = () => (
    <>
      <Form layout="inline" onFinish={addSo}>
        <Form.Item name="nam" rules={[{ required: true }]}>
          <Input placeholder="Năm" />
        </Form.Item>
        <Button htmlType="submit">Thêm</Button>
      </Form>

      <Table
        dataSource={soList}
        rowKey="id"
        columns={[
          { title: "Năm", dataIndex: "nam" },
          { title: "Số hiện tại", dataIndex: "soHienTai" },
        ]}
      />
    </>
  );

  const renderQD = () => (
    <>
      <Form layout="inline" onFinish={addQD}>
        <Form.Item name="soQD" rules={[{ required: true }]}>
          <Input placeholder="Số QĐ" />
        </Form.Item>
        <Form.Item name="ngay" rules={[{ required: true }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="soVanBangId" rules={[{ required: true }]}>
          <Select placeholder="Sổ">
            {soList.map((s) => (
              <Option key={s.id} value={s.id}>
                {s.nam}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button htmlType="submit">Thêm</Button>
      </Form>

      <Table
        dataSource={qdList}
        rowKey="id"
        columns={[
          { title: "Số QĐ", dataIndex: "soQD" },
          { title: "Ngày", dataIndex: "ngay" },
          {
            title: "Lượt tra cứu",
            render: (_, r) => qdCount[r.id] || 0,
          },
        ]}
      />
    </>
  );

  const renderField = () => (
    <>
      <Form layout="inline" onFinish={addField}>
        <Form.Item name="name" rules={[{ required: true }]}>
          <Input placeholder="Tên field" />
        </Form.Item>
        <Form.Item name="type">
          <Select>
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
            <Option value="date">Date</Option>
          </Select>
        </Form.Item>
        <Button htmlType="submit">Thêm</Button>
      </Form>

      <Table
        dataSource={fields}
        rowKey="id"
        columns={[
          { title: "Tên", dataIndex: "name" },
          { title: "Kiểu", dataIndex: "type" },
          {
            title: "Action",
            render: (_, r) => (
              <Button danger onClick={() => deleteField(r.id)}>
                Xóa
              </Button>
            ),
          },
        ]}
      />
    </>
  );

  const renderVB = () => (
    <Form layout="vertical" onFinish={addVanBang}>
      <Form.Item name="soHieu" label="Số hiệu" rules={[{ required: true }]}> 
        <Input />
      </Form.Item>
      <Form.Item name="msv" label="MSV" rules={[{ required: true }]}> 
        <Input />
      </Form.Item>
      <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}> 
        <Input />
      </Form.Item>
      <Form.Item name="ngaySinh" label="Ngày sinh" rules={[{ required: true }]}> 
        <DatePicker />
      </Form.Item>

      <Form.Item name="soVanBangId" label="Sổ" rules={[{ required: true }]}> 
        <Select>
          {soList.map((s) => (
            <Option key={s.id} value={s.id}>
              {s.nam}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="quyetDinhId" label="Quyết định" rules={[{ required: true }]}> 
        <Select>
          {qdList.map((q) => (
            <Option key={q.id} value={q.id}>
              {q.soQD}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {fields.map((f) => (
        <Form.Item key={f.id} name={f.name} label={f.name}>
          {f.type === "string" && <Input />}
          {f.type === "number" && <Input type="number" />}
          {f.type === "date" && <DatePicker />}
        </Form.Item>
      ))}

      <Button htmlType="submit" type="primary">
        Thêm văn bằng
      </Button>
    </Form>
  );

  const renderSearch = () => (
    <>
      <Form layout="inline" onFinish={search}>
        <Form.Item name="soVaoSo">
          <Input placeholder="Số vào sổ" />
        </Form.Item>
        <Form.Item name="soHieu">
          <Input placeholder="Số hiệu" />
        </Form.Item>
        <Form.Item name="msv">
          <Input placeholder="MSV" />
        </Form.Item>
        <Form.Item name="hoTen">
          <Input placeholder="Họ tên" />
        </Form.Item>
        <Button htmlType="submit">Tra cứu</Button>
      </Form>

      <Table
        dataSource={searchResult}
        rowKey="id"
        columns={[
          { title: "Số vào sổ", dataIndex: "soVaoSo" },
          { title: "Số hiệu", dataIndex: "soHieu" },
          { title: "MSV", dataIndex: "msv" },
          { title: "Họ tên", dataIndex: "hoTen" },
          { title: "Ngày sinh", dataIndex: "ngaySinh" },
        ]}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu
          theme="dark"
          onClick={(e) => setSelectedMenu(e.key)}
          selectedKeys={[selectedMenu]}
        >
          <Menu.Item key="so">Sổ</Menu.Item>
          <Menu.Item key="qd">Quyết định</Menu.Item>
          <Menu.Item key="field">Biểu mẫu</Menu.Item>
          <Menu.Item key="vb">Văn bằng</Menu.Item>
          <Menu.Item key="search">Tra cứu</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ color: "#fff" }}>Quản lý văn bằng</Header>
        <Content style={{ padding: 20 }}>
          {selectedMenu === "so" && renderSo()}
          {selectedMenu === "qd" && renderQD()}
          {selectedMenu === "field" && renderField()}
          {selectedMenu === "vb" && renderVB()}
          {selectedMenu === "search" && renderSearch()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;