import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import i18n from '../translation/i18n';
import {
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const InputForm = () => {

  const navigate = useNavigate();

  const onFinish = (value) => {
    //chuyển đến trang voucher và truyền dữ liệu
    console.log('Success:', value);
    navigate("/voucher", { state: value });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    i18n.changeLanguage(e.target.value);
  };

  const changeLanguage = (e) => {
    console.log(e);
    i18n.changeLanguage(e);
  }

  return (
    <div className='container' >
      <Form
        className='form-container'
        name="basic"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}

        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <h3 style={{ textAlign: 'center' }}>Nhập thông tin booking</h3>

        <Form.Item
          label="Tên khách hàng"
          name="name"
          rules={[
            {
              required: false,
              message: 'Please input your name!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            {
              required: false,
              message: 'Please input your phone!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* //Nhập email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: false,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input />
        </Form.Item>



        <Form.Item
          label="Tên khách sạn"
          name="hotelName"
          rules={[
            {
              required: false,
              message: 'Please input your hotel name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* Địa chỉ khách sạn */}
        <Form.Item
          label="Địa chỉ khách sạn"
          name="hotelAddress"
          rules={[
            {
              required: false,
              message: 'Please input your hotel address!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* Giờ checkin và checkout */}
        <Form.Item
          label="Giờ checkin và checkout"
          name="checkinCheckout"
          rules={[
            {
              required: false,
              message: 'Please input your checkin and checkout!',
            },
          ]}
        >
          <RangePicker
            showTime={true}
          />
        </Form.Item>
        <h3 style={{ textAlign: 'center' }}>Nhập thông tin phòng </h3>

        <Form.Item
          label="Mã phòng"
          name="code"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Loại phòng"
          name="roomType"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="quantity"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tổng tiền"
          name="totalPrice"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Thông tin thanh toán"
          name="paymentInfo"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Ghi chú"
          name="note"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Ngôn ngữ"
          name="language"
        >
          <Select onChange={changeLanguage}>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="vi">Vietnamese</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
export default () => <InputForm />;