import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

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


const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const InputForm = () => {

  const navigate = useNavigate();

  const onFinish = (value) => {
    //chuyển đến trang voucher và truyền dữ liệu
    console.log('Success:', value);
    navigate("/voucher", { state: value });
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);

  };

  return (
    <div className='container' >
      <Form
        className='form-container'
        name="basic"
        labelCol={{
          span: 10,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <div className='client-container1'>
          <div className='client-title'>
            <h3>Thông tin khách hàng</h3>
          </div>
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
          {/* //Nhập địa chỉ */}
        </div>



        {/* Thông tin khách sạn container*/}
        <div className='hotel-container'>
          <div className='hotel-title'>
            <h3>Thông tin khách sạn</h3>
          </div>
          {/* Tên khách sạn */}
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
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              
             />
          </Form.Item>
        </div>


        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
export default () => <InputForm />;