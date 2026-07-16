import { useMemo, useRef, useState } from 'react';
import { Button, Card, Form, Input, List, Modal, Popconfirm, Space, Typography, message } from 'antd';
import { downloadHotelData, parseImportedHotelData } from '../../data/hotelStore';
import { GlobalState } from '../../context/GlobalProvider';
import './style.css';

const emptyHotel = {
  name: '',
  address: '',
  logo: '22Housing',
  benefit: [],
};

const HotelManagement = () => {
  const { hotels, roomTypes, updateHotelData, resetHotelData } = GlobalState();
  const [editingHotel, setEditingHotel] = useState(null);
  const importInputRef = useRef(null);
  const [form] = Form.useForm();

  const sortedHotels = useMemo(
    () => [...hotels].sort((first, second) => String(first.name).localeCompare(String(second.name))),
    [hotels],
  );

  const openEditor = (hotel) => {
    const nextHotel = hotel
      ? { ...hotel, benefitText: (hotel.benefit || []).join('\n') }
      : { ...emptyHotel, id: Math.max(0, ...hotels.map((item) => Number(item.id) || 0)) + 1, benefitText: '' };
    setEditingHotel(nextHotel);
    form.setFieldsValue(nextHotel);
  };

  const closeEditor = () => {
    setEditingHotel(null);
    form.resetFields();
  };

  const saveHotel = (values) => {
    const nextHotel = {
      id: Number(values.id),
      name: values.name.trim(),
      address: values.address.trim(),
      logo: values.logo?.trim() || '22Housing',
      benefit: values.benefitText
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const nextHotels = editingHotel && hotels.some((hotel) => hotel.id === editingHotel.id)
      ? hotels.map((hotel) => (hotel.id === editingHotel.id ? nextHotel : hotel))
      : [...hotels, nextHotel];

    updateHotelData({ hotels: nextHotels, roomTypes });
    message.success('Đã lưu thông tin khách sạn.');
    closeEditor();
  };

  const deleteHotel = (hotelId) => {
    updateHotelData({ hotels: hotels.filter((hotel) => hotel.id !== hotelId), roomTypes });
    message.success('Đã xóa khách sạn.');
  };

  const importHotels = (event) => {
    const [file] = event.target.files || [];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const importedData = parseImportedHotelData(reader.result);
        updateHotelData(importedData);
        message.success(`Đã nhập ${importedData.hotels.length} khách sạn.`);
      } catch (error) {
        message.error(error.message || 'File JSON không hợp lệ.');
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="hotel-management-page">
      <Card>
        <div className="hotel-management-header">
          <div>
            <Typography.Title level={2}>Quản lý khách sạn</Typography.Title>
            <Typography.Paragraph>
              Dữ liệu được lưu trên trình duyệt này bằng localStorage. Hãy export định kỳ để sao lưu.
            </Typography.Paragraph>
          </div>
          <Space wrap>
            <Button type="primary" onClick={() => openEditor()}>Thêm khách sạn</Button>
            <Button onClick={() => downloadHotelData({ hotels, roomTypes })}>Export JSON</Button>
            <Button onClick={() => importInputRef.current?.click()}>Import JSON</Button>
            <Popconfirm
              title="Khôi phục dữ liệu mặc định?"
              description="Dữ liệu localStorage hiện tại sẽ bị xóa."
              onConfirm={resetHotelData}
              okText="Khôi phục"
              cancelText="Hủy"
            >
              <Button>Khôi phục mặc định</Button>
            </Popconfirm>
            <input ref={importInputRef} type="file" accept="application/json" onChange={importHotels} hidden />
          </Space>
        </div>

        <List
          bordered
          dataSource={sortedHotels}
          locale={{ emptyText: 'Chưa có khách sạn' }}
          renderItem={(hotel) => (
            <List.Item
              actions={[
                <Button key="edit" type="link" onClick={() => openEditor(hotel)}>Sửa</Button>,
                <Popconfirm
                  key="delete"
                  title="Xóa khách sạn này?"
                  onConfirm={() => deleteHotel(hotel.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="link" danger>Xóa</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={`${hotel.name} (#${hotel.id})`}
                description={`${hotel.address} · ${hotel.benefit?.length || 0} quyền lợi`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title={editingHotel?.id && hotels.some((hotel) => hotel.id === editingHotel.id) ? 'Sửa khách sạn' : 'Thêm khách sạn'}
        open={Boolean(editingHotel)}
        onCancel={closeEditor}
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={saveHotel}>
          <Form.Item name="id" label="ID" rules={[{ required: true, message: 'Nhập ID khách sạn.' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="name" label="Tên khách sạn" rules={[{ required: true, message: 'Nhập tên khách sạn.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Nhập địa chỉ.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="logo" label="Logo key">
            <Input placeholder="22Housing hoặc 22Land" />
          </Form.Item>
          <Form.Item name="benefitText" label="Quyền lợi (mỗi dòng một mục)">
            <Input.TextArea rows={5} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HotelManagement;
