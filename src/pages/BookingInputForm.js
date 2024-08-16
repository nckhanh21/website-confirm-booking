import React from 'react';
import { Form, Input, Button, DatePicker, AutoComplete, Select, Typography, Space } from 'antd';

const { Title } = Typography;

const BookingInputForm = ({ onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [options] = React.useState([
    { value: 'Superior Room' },
    { value: 'Deluxe Room' },
    { value: 'Suite Room' },
  ]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

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
        <Form.List name="rooms">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} style={styles.roomSection}>
                  <Title level={3} style={styles.roomTitle}>Phòng {key + 1}</Title>
                  <Form.Item
                    {...restField}
                    name={[name, 'roomType']}
                    fieldKey={[fieldKey, 'roomType']}
                    label="Loại phòng"
                    rules={[{ required: true, message: 'Loại phòng là bắt buộc!' }]}
                  >
                    <AutoComplete
                      options={options}
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
                    rules={[{ required: true, message: 'Ngày đến là bắt buộc!' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={styles.input}
                      placeholder="Chọn ngày và giờ đến"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'departureDate']}
                    fieldKey={[fieldKey, 'departureDate']}
                    label="Ngày đi"
                    rules={[{ required: true, message: 'Ngày đi là bắt buộc!' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={styles.input}
                      placeholder="Chọn ngày và giờ đi"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'roomPrice']}
                    fieldKey={[fieldKey, 'roomPrice']}
                    label="Giá phòng (1 đêm)"
                    rules={[{ required: true, message: 'Giá phòng là bắt buộc!' }]}
                  >
                    <Input type="number" placeholder="Nhập giá phòng" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'deposit']}
                    fieldKey={[fieldKey, 'deposit']}
                    label="Tiền cọc"
                    rules={[{ required: true, message: 'Tiền cọc là bắt buộc!' }]}
                  >
                    <Input type="number" placeholder="Nhập tiền cọc" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'paymentMethod']}
                    fieldKey={[fieldKey, 'paymentMethod']}
                    label="Phương thức thanh toán"
                    rules={[{ required: true, message: 'Phương thức thanh toán là bắt buộc!' }]}
                  >
                    <Select placeholder="Chọn phương thức thanh toán">
                      <Select.Option value="Chuyển khoản">Chuyển khoản</Select.Option>
                      <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'specialRequests']}
                    fieldKey={[fieldKey, 'specialRequests']}
                    label="Yêu cầu đặc biệt"
                  >
                    <Input.TextArea rows={4} placeholder="Nhập yêu cầu đặc biệt" />
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
