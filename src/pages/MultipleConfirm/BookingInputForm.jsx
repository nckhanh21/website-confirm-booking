import React, { useEffect, useMemo } from 'react';
import { Form, Input, Button, DatePicker, AutoComplete, Select, Typography, Space, InputNumber, Row, Col } from 'antd';
import dayjs from 'dayjs';
import { GlobalState } from '../../context/GlobalProvider';
import './BookingInputForm.css';

const { Title } = Typography;
const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

const getDefaultArrivalDate = () => dayjs().hour(14).minute(0).second(0).millisecond(0);
const getDefaultDepartureDate = () => dayjs().hour(12).minute(0).second(0).millisecond(0);

const getDefaultRoom = () => ({
  arrivalDate: getDefaultArrivalDate(),
  departureDate: getDefaultDepartureDate(),
});

const currencyFormatter = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const currencyParser = (value) => {
  if (!value) {
    return '';
  }

  return value.replace(/\$\s?|(,*)/g, '');
};

const getNights = (arrivalDate, departureDate) => {
  if (!arrivalDate || !departureDate) {
    return 0;
  }

  const arrival = dayjs(arrivalDate);
  const departure = dayjs(departureDate);

  if (!arrival.isValid() || !departure.isValid() || !departure.isAfter(arrival)) {
    return 0;
  }

  const diffHours = departure.diff(arrival, 'hour', true);
  return Math.max(1, Math.floor(diffHours / 24));
};

const calculateAmount = (room) => {
  const roomPrice = Number(room?.roomPrice) || 0;
  if (!roomPrice) {
    return undefined;
  }

  const nights = getNights(room?.arrivalDate, room?.departureDate);
  if (!nights) {
    return undefined;
  }

  return roomPrice * nights;
};

const BookingInputForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [hotelOptions, setHotelOptions] = React.useState([]);
  const { hotels, roomTypes } = GlobalState();

  const normalizedInitialValues = useMemo(() => {
    if (!initialValues) {
      return {
        template: 'classic',
        rooms: [getDefaultRoom()],
      };
    }

    return {
      ...initialValues,
      template: initialValues.template || 'classic',
      deposit: initialValues.deposit ? Number(initialValues.deposit) : undefined,
      rooms: (initialValues.rooms && initialValues.rooms.length ? initialValues.rooms : [getDefaultRoom()]).map((room) => ({
        ...room,
        roomPrice: room?.roomPrice ? Number(room.roomPrice) : undefined,
        amount: room?.amount ? Number(room.amount) : undefined,
        arrivalDate: room?.arrivalDate ? dayjs(room.arrivalDate) : getDefaultArrivalDate(),
        departureDate: room?.departureDate ? dayjs(room.departureDate) : getDefaultDepartureDate(),
      })),
      additionalServices: (initialValues.additionalServices || []).map((service) => ({
        ...service,
        servicePrice: service?.servicePrice ? Number(service.servicePrice) : undefined,
      })),
    };
  }, [initialValues]);


  useEffect(() => {
    loadListHotel();
  }, [hotels]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      deposit: values.deposit ? Number(values.deposit) : 0,
      rooms: (values.rooms || []).map((room) => ({
        ...room,
        roomPrice: room?.roomPrice ? Number(room.roomPrice) : 0,
        amount: room?.amount ? Number(room.amount) : 0,
        arrivalDate: room?.arrivalDate?.toISOString ? room.arrivalDate.toISOString() : room?.arrivalDate,
        departureDate: room?.departureDate?.toISOString ? room.departureDate.toISOString() : room?.departureDate,
      })),
      additionalServices: (values.additionalServices || []).map((service) => ({
        ...service,
        servicePrice: service?.servicePrice ? Number(service.servicePrice) : 0,
      })),
    };

    onSubmit(payload);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const loadListHotel = () => {
    const mappedHotelOptions = hotels.map((hotel) => ({
      label: hotel.address + ' - ' + hotel.name,
      value: hotel.id,
      address: hotel.address,
      benefit: hotel.benefit,
      logo: hotel.logo
    }));
    setHotelOptions(mappedHotelOptions);
  }


  const onChangeHotel = (value) => {
    const hotel = hotels.find((hotel) => hotel.id === value);
    if (!hotel) {
      return;
    }

    form.setFieldsValue({
      hotelAddress: hotel.address,
      hotelName: hotel.name,
      benefit: hotel.benefit,
      logo: hotel.logo
    });
  }

  const handleValuesChange = (changedValues, allValues) => {
    if (!changedValues.rooms) {
      return;
    }

    const changedRoomIndexes = [];
    changedValues.rooms.forEach((changedRoom, index) => {
      if (!changedRoom) {
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(changedRoom, 'roomPrice') ||
        Object.prototype.hasOwnProperty.call(changedRoom, 'arrivalDate') ||
        Object.prototype.hasOwnProperty.call(changedRoom, 'departureDate')
      ) {
        changedRoomIndexes.push(index);
      }
    });

    if (!changedRoomIndexes.length) {
      return;
    }

    const currentRooms = allValues.rooms || [];
    let changed = false;

    const nextRooms = currentRooms.map((room, index) => {
      if (!changedRoomIndexes.includes(index)) {
        return room;
      }

      const autoAmount = calculateAmount(room);
      const currentAmount = room?.amount;

      if ((autoAmount || 0) !== (Number(currentAmount) || 0) && autoAmount !== undefined) {
        changed = true;
        return {
          ...room,
          amount: autoAmount,
        };
      }

      return room;
    });

    if (changed) {
      form.setFieldsValue({ rooms: nextRooms });
    }
  };

  const handleAddRoom = (add) => {
    const rooms = form.getFieldValue('rooms') || [];
    const latestRoom = rooms[rooms.length - 1] || getDefaultRoom();

    add({
      roomType: latestRoom.roomType,
      arrivalDate: latestRoom.arrivalDate || getDefaultArrivalDate(),
      departureDate: latestRoom.departureDate || getDefaultDepartureDate(),
      roomPrice: latestRoom.roomPrice,
      amount: latestRoom.amount,
    });
  };

  return (
    <div className="booking-form-page">
      <div className="booking-form-card">
      <Title level={2} style={styles.title}>Nhập Thông Tin Đặt Phòng</Title>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={normalizedInitialValues}
        onValuesChange={handleValuesChange}
        layout="vertical"
        style={styles.form}
        className="booking-form"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên booker"
              name="bookerName"
            >
              <Input placeholder="Nhập tên người đặt" autoFocus />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Tên khách sạn"
              name="hotelName"
              rules={[{ required: true, message: 'Tên khách sạn bắt buộc!' }]}
            >
              <Select
                showSearch
                placeholder="Chọn khách sạn"
                optionFilterProp="label"
                onChange={onChangeHotel}
                filterOption={filterOption}
                options={hotelOptions}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label="Mẫu xác nhận"
              name="template"
              rules={[{ required: true, message: 'Vui lòng chọn mẫu xác nhận!' }]}
            >
              <Select
                options={[
                  { label: 'Classic · Truyền thống', value: 'classic' },
                  { label: 'Contemporary · Hiện đại', value: 'modern' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={10}>
            <Form.Item
              label="Địa chỉ khách sạn"
              name="hotelAddress"
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item
              name={'deposit'}
              fieldKey={'deposit'}
              label="Tiền cọc"
            >
              <InputNumber
                style={styles.input}
                min={0}
                controls={false}
                placeholder="Nhập tiền cọc"
                formatter={currencyFormatter}
                parser={currencyParser}
                addonAfter="VND"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="dịch vụ đi kèm"
          name="benefit"
          style={{ display: 'none' }}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="logo"
          name="logo"
          style={{ display: 'none' }}
        >
          <Input />
        </Form.Item>

        <Form.List name="rooms">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} className="booking-room-section">
                  <Title level={3} style={styles.roomTitle}>Phòng {key + 1}</Title>
                  <Form.Item
                    label="Tên khách hàng"
                    name={[name, 'name']}
                    fieldKey={[fieldKey, 'name']}
                    rules={[
                      {
                        required: false,
                        message: 'Please input your name!',
                      },
                    ]}
                  >
                    <Input.TextArea placeholder='Nhập tên' autoSize={{ minRows: 1, maxRows: 3 }} />
                  </Form.Item>
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12} lg={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'roomType']}
                        fieldKey={[fieldKey, 'roomType']}
                        label="Loại phòng"
                        rules={[{ required: false, message: 'Loại phòng là bắt buộc!' }]}
                      >
                        <AutoComplete
                          options={roomTypes}
                          style={styles.input}
                          placeholder="Nhập loại phòng"
                        >
                          <Input />
                        </AutoComplete>
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12} lg={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'arrivalDate']}
                        fieldKey={[fieldKey, 'arrivalDate']}
                        label="Ngày đến"
                        rules={[{ required: false, message: 'Ngày đến là bắt buộc!' }]}
                      >
                        <DatePicker
                          showTime
                          format={DATE_FORMAT}
                          style={styles.input}
                          placeholder="Chọn ngày và giờ đến"
                          minuteStep={15}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12} lg={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'departureDate']}
                        fieldKey={[fieldKey, 'departureDate']}
                        label="Ngày đi"
                        rules={[{ required: false, message: 'Ngày đi là bắt buộc!' }]}
                      >
                        <DatePicker
                          showTime
                          format={DATE_FORMAT}
                          style={styles.input}
                          placeholder="Chọn ngày và giờ đi"
                          minuteStep={15}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item shouldUpdate noStyle>
                    {() => {
                      const arrivalDate = form.getFieldValue(['rooms', name, 'arrivalDate']);
                      const departureDate = form.getFieldValue(['rooms', name, 'departureDate']);
                      const nights = getNights(arrivalDate, departureDate);

                      return (
                        <div className="nights-info" style={styles.nightsInfo}>
                          Số đêm: <strong>{nights || 0}</strong>
                        </div>
                      );
                    }}
                  </Form.Item>

                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'roomPrice']}
                        fieldKey={[fieldKey, 'roomPrice']}
                        label="Giá phòng (1 đêm)"
                      >
                        <InputNumber
                          style={styles.input}
                          min={0}
                          controls={false}
                          placeholder="Nhập giá phòng"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                          addonAfter="VND"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, 'amount']}
                        fieldKey={[fieldKey, 'amount']}
                        label="Thành tiền"
                        extra="Tự tính theo số đêm x giá phòng (có thể sửa nếu cần)."
                      >
                        <InputNumber
                          style={styles.input}
                          min={0}
                          controls={false}
                          placeholder="Nhập tiền"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                          addonAfter="VND"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Button type="danger" onClick={() => remove(name)} style={styles.removeButton} className="booking-remove-btn">
                    Xóa phòng
                  </Button>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => handleAddRoom(add)} style={styles.addButton} className="booking-add-btn">
                  Thêm phòng
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Phần dịch vụ bổ sung */}
        <Title level={3} style={styles.sectionTitle}>Dịch vụ bổ sung</Title>
        <Form.List name="additionalServices">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} className="booking-service-section">
                  <Row gutter={[16, 0]}>
                    <Col xs={24} md={16}>
                      <Form.Item
                        {...restField}
                        name={[name, 'serviceName']}
                        fieldKey={[fieldKey, 'serviceName']}
                        label="Tên dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                      >
                        <Input placeholder="Ví dụ: Decor, Airport pick up, ..." />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                      <Form.Item
                        {...restField}
                        name={[name, 'servicePrice']}
                        fieldKey={[fieldKey, 'servicePrice']}
                        label="Giá dịch vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
                      >
                        <InputNumber
                          style={styles.input}
                          min={0}
                          controls={false}
                          placeholder="Nhập giá dịch vụ"
                          formatter={currencyFormatter}
                          parser={currencyParser}
                          addonAfter="VND"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Button type="danger" onClick={() => remove(name)} style={styles.removeButton} className="booking-remove-btn">
                    Xóa dịch vụ
                  </Button>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} style={styles.addButton} className="booking-add-btn">
                  Thêm dịch vụ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Space className="booking-submit-wrap">
            <Button type="primary" htmlType="submit" style={styles.submitButton}>
              Xác nhận
            </Button>
          </Space>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

const styles = {
  title: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  form: {
    marginTop: '0px',
  },
  input: {
    width: '100%',
  },
  roomTitle: {
    marginBottom: '16px',
  },
  nightsInfo: {
    marginTop: '-2px',
    marginBottom: '12px',
    color: '#555',
    fontSize: '13px',
  },
  sectionTitle: {
    marginTop: '24px',
    marginBottom: '12px',
  },
  addButton: {
    width: '100%',
    marginBottom: '14px',
  },
  removeButton: {
    marginTop: '8px',
  },
  submitButton: {
    width: '100%',
  },
};

export default BookingInputForm;
