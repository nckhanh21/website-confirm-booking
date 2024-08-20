import React, { useEffect } from 'react';
import { Form, Input, Button, DatePicker, AutoComplete, Select, Typography, Space } from 'antd';
import { hotelList, roomTypeList } from '../../constants/hotel';

const { Title } = Typography;

const BookingInputForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [options] = React.useState([
    { value: 'Superior Room' },
    { value: 'Deluxe Room' },
    { value: 'Suite Room' },
  ]);
  const [hotelOptions, setHotelOptions] = React.useState([]);


  useEffect(() => {
    loadListHotel();
  }, []);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const loadListHotel = () => {
    const hotelOptions = hotelList.map((hotel) => ({
      label: hotel.address + ' - ' + hotel.name,
      value: hotel.id,
      address: hotel.address,
      benefit: hotel.benefit,
      logo: hotel.logo
    }));
    setHotelOptions(hotelOptions);
  }


  const onChangeHotel = (value) => {
    console.log(value);
    //lấy ra hotel theo id
    const hotel = hotelList.find((hotel) => hotel.id === value);
    // setHotel(hotel);
    //đổi giá trị của form item hotelAddress
    form.setFieldsValue({
      hotelAddress: hotel.address,
      hotelName: hotel.name,
      benefit: hotel.benefit,
      logo: hotel.logo
    });
  }

  return (
    <div style={styles.container}>
      <Title level={2} style={styles.title}>Nhập Thông Tin Đặt Phòng</Title>
      <Form
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
        layout="vertical"
        style={styles.form}
      >
        <Form.Item
          label="Tên booker"
          name="bookerName"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên khách sạn"
          name="hotelName"
          rules={[{ required: true, message: 'Tên khách sạn bắt buộc!' }]}
        >
          <Select
            showSearch
            placeholder="Chọn khách sạn"
            optionFilterProp="children"
            onChange={onChangeHotel}
            // onSearch={onSearch}
            filterOption={filterOption}
            options={hotelOptions}
          />
        </Form.Item>
        <Form.Item
          label="Địa chỉ khách sạn"
          name="hotelAddress"
        >
          <Input disabled />
        </Form.Item>
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
        <Form.Item
          name={'deposit'}
          fieldKey={'deposit'}
          label="Tiền cọc"
        // rules={[{ required: false, message: 'Tiền cọc là bắt buộc!' }]}
        >
          <Input type='number' placeholder="Nhập tiền cọc" onWheel={(e) => e.target.blur()} />
        </Form.Item>
        {/* <Form.Item
          name="paymentMethod"
          label="Phương thức thanh toán"
          rules={[{ required: true, message: 'Phương thức thanh toán là bắt buộc!' }]}
        >
          <Select placeholder="Chọn phương thức thanh toán" style={styles.input}>
            <Select.Option value="Chuyển khoản">Chuyển khoản</Select.Option>
            <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
          </Select>
        </Form.Item> */}
        <Form.List name="rooms">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} style={styles.roomSection}>
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
                    <Input placeholder='Nhập tên' />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'roomType']}
                    fieldKey={[fieldKey, 'roomType']}
                    label="Loại phòng"
                    rules={[{ required: false, message: 'Loại phòng là bắt buộc!' }]}
                  >
                    <AutoComplete
                      options={roomTypeList}
                      style={styles.input}
                      placeholder="Nhập loại phòng"
                    >
                      <Input.Search />
                    </AutoComplete>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'arrivalDate']}
                    fieldKey={[fieldKey, 'arrivalDate']}
                    label="Ngày đến"
                    rules={[{ required: false, message: 'Ngày đến là bắt buộc!' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={styles.input}
                      placeholder="Chọn ngày và giờ đến"
                      minuteStep={15}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'departureDate']}
                    fieldKey={[fieldKey, 'departureDate']}
                    label="Ngày đi"
                    rules={[{ required: false, message: 'Ngày đi là bắt buộc!' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={styles.input}
                      placeholder="Chọn ngày và giờ đi"
                      minuteStep={15}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'roomPrice']}
                    fieldKey={[fieldKey, 'roomPrice']}
                    label="Giá phòng (1 đêm)"
                  // rules={[{ required: false, message: 'Giá phòng là bắt buộc!' }]}
                  >
                    <Input type='number' placeholder="Nhập giá phòng"  onWheel={(e) => e.target.blur()}/>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'amount']}
                    fieldKey={[fieldKey, 'amount']}
                    label="Thành tiền"
                  >
                    <Input type='number' placeholder="Nhập tiền"  onWheel={(e) => e.target.blur()}/>
                  </Form.Item>
                  <Button type="danger" onClick={() => remove(name)} style={styles.removeButton}>
                    Xóa phòng
                  </Button>
                </div>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} style={styles.addButton}>
                  Thêm phòng
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>



        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" style={styles.submitButton}>
              Xác nhận
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

const styles = {
  container: {
    width: '500px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
  },
  roomSection: {
    marginBottom: '20px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  roomTitle: {
    marginBottom: '10px',
  },
  removeButton: {
    marginTop: '10px',
  },
  addButton: {
    width: '100%',
    marginTop: '10px',
  },
};

export default BookingInputForm;
