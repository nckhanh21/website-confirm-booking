import { PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import i18n from '../translation/i18n';
import dayjs from 'dayjs';
import './styles/input-form.css';
import {
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
import FacebookLogin from 'react-facebook-login';
import { hotelList, roomTypeList } from '../constants/hotel';
import { GlobalState } from '../context/GlobalProvider';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const dateFormat = 'YYYY-MM-DD HH:mm';
const FacebookPage = () => {

    const [hotelOptions, setHotelOptions] = useState([]);
    const { bookingInfo, setBookingInfo } = GlobalState();

    const responseFacebook = (response) => {
        console.log(response);
    }

    return (
        <div className='container' >
          
        </div>
    );
};
export default () => <FacebookPage />;