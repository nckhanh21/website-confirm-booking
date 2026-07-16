import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import i18n from '../../translation/i18n';
import dayjs from 'dayjs';
import '../styles/input-form.css';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
} from 'antd';
import { hotelList, roomTypeList } from '../../constants/hotel';
import { GlobalState } from '../../context/GlobalProvider';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD HH:mm';
const InputForm = () => {
  const [openModalAddHotel, setOpenModalAddHotel] = useState(false);

  const [hotelOptions, setHotelOptions] = useState([]);

  const { bookingInfo, setBookingInfo } = GlobalState();

  const [form] = Form.useForm();


  useEffect(() => {
    loadListHotel();
  }, []);

  const loadListHotel = () => {
    const hotelOptions = hotelList.map((hotel) => ({
      label: hotel.address + ' - ' + hotel.name,
      value: hotel.id,
      address: hotel.address,
    }));
    setHotelOptions(hotelOptions);
  }


  const navigate = useNavigate();

  const onFinish = (value) => {
    //chuyển đến trang voucher và truyền dữ liệu
    console.log('Success:', value);
    setBookingInfo(value);
    if (value.template === 'normal') {
      navigate('/voucher');
    } else if (value.template === 'chrismas') {
      navigate('/voucher-chrismas');
    } else if (value.template === 'chrismas2') {
      navigate('/voucher-chrismas-2');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const changeLanguage = (e) => {
    console.log(e);
    i18n.changeLanguage(e);
  }

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


  const onChangeHotel = (value) => {
    console.log(value);
    //lấy ra hotel theo id
    const hotel = hotelList.find((hotel) => hotel.id === value);
    // setHotel(hotel);
    //đổi giá trị của form item hotelAddress
    form.setFieldsValue({
      hotelAddress: hotel.address,
      hotelName: hotel.name,
    });
  }

  const handleOpenModalAddHotel = () => {
    console.log('handleOpenModalAddHotel');
    setOpenModalAddHotel(true);
  }


  return (
    <div className='container' >
      <Form
        form={form}
        className='form-container'
        name="basic"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}

        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        //Điền sẵn dữ liệu nếu có dữ liệu truyền vào từ trang khác
        initialValues={bookingInfo}

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
        {/* <Form.Item
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
        </Form.Item> */}



        <Form.Item
          label="Tên khách sạn"
          name="hotelName"
        >
          <Select
            showSearch
            placeholder="Chọn khách sạn"
            optionFilterProp="children"
            onChange={onChangeHotel}
            // onSearch={onSearch}
            filterOption={filterOption}
            options={hotelOptions}
            //thêm khách sạn mới
            suffixIcon={<PlusOutlined onClick={handleOpenModalAddHotel} />}
          //click suffixIcon
          />
        </Form.Item>
        {/* Địa chỉ khách sạn */}
        <Form.Item
          label="Địa chỉ khách sạn"
          name="hotelAddress"
        >
          <Input disabled />
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
            format={"DD/MM/YYYY HH:mm"}
            minuteStep={15}
          // Cài đặt mặc định giá trị phút và giờ 
          // defaultValue={[
          //   dayjs().hour(14).minute(0),
          //   dayjs().add(1, 'day').hour(12).minute(0),
          // ]}
          />
        </Form.Item>
        <h3 style={{ textAlign: 'center' }}>Nhập thông tin phòng </h3>
        {/* 
        <Form.Item
          label="Mã phòng"
          name="code"
        >
          <Input />
        </Form.Item> */}
        <Form.Item
          label="Loại phòng"
          name="roomType"
        >
          <AutoComplete
            options={roomTypeList}
            placeholder="Chọn loại phòng"
            filterOption={(inputValue, option) =>
              option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
          />
        </Form.Item>
        <Form.Item
          label="Số lượng"
          name="quantity"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số người"
          name="numberOfPeople"
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
          <Select onChange={changeLanguage} defaultValue={'vi'}>
            <Select.Option value="en">English</Select.Option>
            <Select.Option value="vi">Vietnamese</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Template"
          name="template"
        >
          <Select >
            <Select.Option value="normal">Normal</Select.Option>
            <Select.Option value="chrismas">Chrismas</Select.Option>
            <Select.Option value="chrismas2">Chrismas 2</Select.Option>
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button type="primary" onClick={() => navigate("/input")}>
            Chuyển
          </Button>
        </div>
        {/* thêm khách sạn mới */}

      </Form>
      <Modal title="Thêm khách sạn mới" open={openModalAddHotel}
        footer={null}
      >
        <Form

          name="basic"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên khách sạn"
            name="name"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input />
          </Form.Item>
          <Form.Item
            //vị trí bên phải 
            wrapperCol={{ offset: 10, span: 14 }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {/* //nút khác tìm khách sạn */}

        </Form>
      </Modal>
    </div>
  );
};
export default () => <InputForm />;