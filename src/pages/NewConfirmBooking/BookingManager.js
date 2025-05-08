import React, { useState, useEffect } from 'react';
import BookingInputForm from './BookingInputForm';
import BookingConfirmation from './NewConfirmation';
import { Tabs, message } from 'antd';
import { FormOutlined, FileDoneOutlined } from '@ant-design/icons';
import './style.css';

const BookingManager = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [activeTab, setActiveTab] = useState('input');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

  useEffect(() => {
    // Thêm event listener để kiểm tra kích thước màn hình
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Xử lý khi form được submit
  const handleFormSubmit = (values) => {
    try {
      // Tính tổng tiền phòng
      if (values.rooms && values.rooms.length > 0) {
        values.rooms.forEach(room => {
          if (!room.amount) {
            // Nếu chưa nhập thành tiền, tự động tính dựa trên giá phòng
            const checkIn = new Date(room.arrivalDate);
            const checkOut = new Date(room.departureDate);
            
            if (checkIn && checkOut && room.roomPrice) {
              // Tính số ngày ở
              const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
              // Tính thành tiền = số ngày * giá phòng/đêm
              room.amount = days * Number(room.roomPrice);
            }
          }
        });
      }
      
      setBookingDetails(values);
      setIsEditing(false);
      setActiveTab('confirmation');
      message.success('Tạo xác nhận đặt phòng thành công!');
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  // Xử lý khi muốn chỉnh sửa
  const handleEditBooking = () => {
    setIsEditing(true);
    setActiveTab('input');
  };

  // Xử lý chuyển tab
  const handleTabChange = (key) => {
    if (key === 'confirmation' && !bookingDetails) {
      message.warning('Vui lòng nhập thông tin đặt phòng trước!');
      return;
    }
    setActiveTab(key);
    setIsEditing(key === 'input');
  };

  const items = [
    {
      key: 'input',
      label: (
        <span className="tab-label">
          <FormOutlined />
          <span className={isMobile ? 'mobile-tab-text' : ''}>{isMobile ? '' : 'Nhập thông tin'}</span>
        </span>
      ),
      children: <BookingInputForm onSubmit={handleFormSubmit} initialValues={bookingDetails} />
    },
    {
      key: 'confirmation',
      label: (
        <span className="tab-label">
          <FileDoneOutlined />
          <span className={isMobile ? 'mobile-tab-text' : ''}>{isMobile ? '' : 'Xác nhận đặt phòng'}</span>
        </span>
      ),
      children: bookingDetails ? (
        <BookingConfirmation details={bookingDetails} onEdit={handleEditBooking} />
      ) : (
        <div className="empty-placeholder">
          Vui lòng nhập thông tin đặt phòng trước
        </div>
      ),
      disabled: !bookingDetails
    }
  ];

  return (
    <div className="booking-manager-container">
      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={handleTabChange}
        type="card"
        size={isMobile ? 'small' : 'large'}
        className="booking-tabs"
      />
    </div>
  );
};

export default BookingManager; 