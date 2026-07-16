import React, { useEffect, useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  AutoComplete, 
  Select, 
  Typography, 
  Space, 
  Divider, 
  Card, 
  InputNumber,
  Row,
  Col,
  Tooltip,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  MinusCircleOutlined, 
  QuestionCircleOutlined,
  CalculatorOutlined 
} from '@ant-design/icons';
import { hotelList, roomTypeList } from '../../constants/hotel';
import moment from 'moment';
import 'moment/locale/vi';
import './style.css';

// Đặt locale cho moment.js
moment.locale('vi');

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const BookingInputForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [hotelOptions, setHotelOptions] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    loadListHotel();
    
    if (initialValues) {
      // Xử lý initialValues một cách an toàn
      const processedValues = {
        ...initialValues,
      };
      
      form.setFieldsValue(processedValues);
      
      if (initialValues.hotelName) {
        const hotel = hotelList.find(h => h.name === initialValues.hotelName);
        if (hotel) setSelectedHotel(hotel);
      }
    }

    // Thêm event listener để kiểm tra kích thước màn hình
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [form]);

  const loadListHotel = () => {
    const options = hotelList.map((hotel) => ({
      label: `${hotel.name} - ${hotel.address}`,
      value: hotel.id,
      hotel: hotel
    }));
    setHotelOptions(options);
  };

  const handleFinish = (values) => {
    try {
      // Đảm bảo các giá trị ngày tháng được xử lý đúng trước khi submit
      const formattedValues = {
        ...values,
        rooms: values.rooms?.map(room => ({
          ...room,
          arrivalDate: room.arrivalDate instanceof moment ? room.arrivalDate.toDate() : room.arrivalDate,
          departureDate: room.departureDate instanceof moment ? room.departureDate.toDate() : room.departureDate
        }))
      };
      
      onSubmit(formattedValues);
    } catch (error) {
      console.error("Lỗi khi submit form:", error);
    }
  };

  const onChangeHotel = (value) => {
    const selectedOption = hotelOptions.find(option => option.value === value);
    if (selectedOption) {
      const hotel = selectedOption.hotel;
      setSelectedHotel(hotel);
      
      form.setFieldsValue({
        hotelAddress: hotel.address,
        hotelName: hotel.name,
        benefit: hotel.benefit,
        logo: hotel.logo
      });
    }
  };

  // Tính toán số ngày ở và tổng tiền khi thay đổi ngày
  const calculateAmount = (roomIndex) => {
    try {
      const rooms = form.getFieldValue('rooms');
      if (!rooms || !rooms[roomIndex]) return;
      
      const room = rooms[roomIndex];
      const { arrivalDate, departureDate, roomPrice } = room;
      
      if (!arrivalDate || !departureDate || !roomPrice) return;
      
      // Chuyển đổi an toàn sang moment
      const checkIn = moment(arrivalDate);
      const checkOut = moment(departureDate);
      
      if (!checkIn.isValid() || !checkOut.isValid()) return;
      
      const days = Math.max(1, checkOut.diff(checkIn, 'days'));
      const amount = days * Number(roomPrice);
      
      // Cập nhật giá trị vào form
      const newRooms = [...rooms];
      newRooms[roomIndex] = {
        ...room,
        amount: amount
      };
      
      form.setFieldsValue({ rooms: newRooms });
    } catch (error) {
      console.error("Lỗi khi tính tiền:", error);
    }
  };

  return (
    <div className="booking-form-container">
      <Card className="booking-form-card">
        <Title level={2} className="booking-form-title">Nhập Thông Tin Đặt Phòng</Title>
        
        <Form
          form={form}
          onFinish={handleFinish}
          initialValues={initialValues}
          layout="vertical"
          style={{ width: '100%' }}
          requiredMark="optional"
          scrollToFirstError
        >
          <Card title="Thông tin đặt phòng" bordered={false} className="booking-form-section">
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                <Form.Item
                  label="Tên người đặt phòng"
                  name="bookerName"
                  tooltip="Người liên hệ đặt phòng"
                  rules={[{ required: true, message: 'Vui lòng nhập tên người đặt!' }]}
                >
                  <Input placeholder="Nhập tên người đặt" />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                <Form.Item
                  label="Tiền đặt cọc"
                  name="deposit"
                  tooltip="Tiền đặt cọc của khách hàng"
                >
                  <InputNumber 
                    style={{ width: '100%' }} 
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    placeholder="Nhập số tiền cọc" 
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Khách sạn"
              name="hotelName"
              rules={[{ required: true, message: 'Vui lòng chọn khách sạn!' }]}
            >
              <Select
                showSearch
                placeholder="Chọn khách sạn"
                optionFilterProp="label"
                onChange={onChangeHotel}
                options={hotelOptions}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ khách sạn"
              name="hotelAddress"
            >
              <Input disabled />
            </Form.Item>

            {/* Hidden fields */}
            <Form.Item name="benefit" style={{ display: 'none' }}>
              <Input.TextArea />
            </Form.Item>
            
            <Form.Item name="logo" style={{ display: 'none' }}>
              <Input />
            </Form.Item>
          </Card>

          {/* Danh sách phòng */}
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>Thông tin phòng</span>
                <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>Thêm thông tin cho từng phòng</Text>
              </div>
            } 
            className="booking-form-section"
          >
            <Form.List 
              name="rooms"
              rules={[
                {
                  validator: async (_, rooms) => {
                    if (!rooms || rooms.length === 0) {
                      return Promise.reject(new Error('Vui lòng thêm ít nhất một phòng'));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                    <Card 
                      key={key} 
                      className="booking-room-card"
                      title={`Phòng ${index + 1}`}
                      extra={
                        <Button 
                          type="text" 
                          danger 
                          icon={<MinusCircleOutlined />} 
                          onClick={() => remove(name)}
                        >
                          {!isMobile && 'Xóa phòng'}
                        </Button>
                      }
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            fieldKey={[fieldKey, 'name']}
                            label="Tên khách hàng"
                            rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                          >
                            <Input.TextArea 
                              placeholder="Nhập tên khách hàng" 
                              autoSize={{ minRows: 2, maxRows: 4 }}
                            />
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                          <Form.Item
                            {...restField}
                            name={[name, 'roomType']}
                            fieldKey={[fieldKey, 'roomType']}
                            label="Loại phòng"
                            rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}
                          >
                            <AutoComplete
                              options={roomTypeList}
                              placeholder="Nhập hoặc chọn loại phòng"
                              filterOption={(inputValue, option) =>
                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col span={24} className="mobile-date-picker">
                          <Form.Item
                            label="Thời gian lưu trú"
                          >
                            {/* Sử dụng 2 DatePicker riêng biệt thay vì RangePicker */}
                            <Row gutter={16}>
                              <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'arrivalDate']}
                                  fieldKey={[fieldKey, 'arrivalDate']}
                                  label="Ngày nhận phòng"
                                  rules={[{ required: true, message: 'Vui lòng chọn ngày nhận phòng!' }]}
                                >
                                  <DatePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="DD-MM-YYYY HH:mm"
                                    style={{ width: '100%' }}
                                    placeholder="Ngày nhận phòng"
                                    onChange={() => {
                                      setTimeout(() => calculateAmount(name), 100);
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'departureDate']}
                                  fieldKey={[fieldKey, 'departureDate']}
                                  label="Ngày trả phòng"
                                  rules={[{ required: true, message: 'Vui lòng chọn ngày trả phòng!' }]}
                                >
                                  <DatePicker
                                    showTime={{ format: 'HH:mm' }}
                                    format="DD-MM-YYYY HH:mm"
                                    style={{ width: '100%' }}
                                    placeholder="Ngày trả phòng"
                                    onChange={() => {
                                      setTimeout(() => calculateAmount(name), 100);
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form.Item>
                        </Col>
                      </Row>

                      <Row gutter={16}>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                          <Form.Item
                            {...restField}
                            name={[name, 'roomPrice']}
                            fieldKey={[fieldKey, 'roomPrice']}
                            label="Giá phòng (1 đêm)"
                            rules={[{ required: true, message: 'Vui lòng nhập giá phòng!' }]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              placeholder="Nhập giá phòng"
                              onChange={() => {
                                setTimeout(() => calculateAmount(name), 100);
                              }}
                            />
                          </Form.Item>
                        </Col>
                        
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} className={isMobile ? 'mobile-full-width' : ''}>
                          <Form.Item
                            {...restField}
                            name={[name, 'amount']}
                            fieldKey={[fieldKey, 'amount']}
                            label={
                              <span>
                                Thành tiền
                                <Tooltip title="Tổng tiền cho toàn bộ thời gian lưu trú">
                                  <QuestionCircleOutlined style={{ marginLeft: 8 }} />
                                </Tooltip>
                              </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng nhập thành tiền!' }]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              placeholder="Nhập thành tiền"
                              addonAfter={
                                <Tooltip title="Tính thành tiền tự động">
                                  <CalculatorOutlined onClick={() => calculateAmount(name)} />
                                </Tooltip>
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}

                  <Form.Item>
                    <Button 
                      type="dashed" 
                      onClick={() => add()} 
                      className="booking-add-button" 
                      icon={<PlusOutlined />}
                    >
                      Thêm phòng
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          {/* Dịch vụ bổ sung */}
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>Dịch vụ bổ sung</span>
                <Text type="secondary" style={{ fontSize: isMobile ? '12px' : '14px' }}>
                  Thêm các dịch vụ đi kèm
                </Text>
              </div>
            } 
            className="booking-form-section"
          >
            <Form.List name="additionalServices">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => (
                    <Row key={key} 
                      gutter={16} 
                      className={isMobile ? 'booking-service-row booking-service-row-mobile' : 'booking-service-row'}
                    >
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'serviceName']}
                          fieldKey={[fieldKey, 'serviceName']}
                          label="Tên dịch vụ"
                          rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                        >
                          <Input placeholder="Ví dụ: Decor, Đưa đón sân bay, ..." />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} sm={16} md={8} lg={8} xl={8}>
                        <Form.Item
                          {...restField}
                          name={[name, 'servicePrice']}
                          fieldKey={[fieldKey, 'servicePrice']}
                          label="Giá dịch vụ"
                          rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
                        >
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            placeholder="Nhập giá dịch vụ"
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} sm={8} md={4} lg={4} xl={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Button 
                          type="text" 
                          danger 
                          icon={<MinusCircleOutlined />} 
                          onClick={() => remove(name)}
                          style={{ marginBottom: isMobile ? '0' : '24px' }}
                        >
                          Xóa
                        </Button>
                      </Col>
                    </Row>
                  ))}

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      className="booking-add-button"
                      icon={<PlusOutlined />}
                    >
                      Thêm dịch vụ
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          <Divider />
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="booking-submit-button">
              Tạo xác nhận đặt phòng
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BookingInputForm; 