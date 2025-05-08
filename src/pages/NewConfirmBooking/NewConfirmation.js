import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Divider, 
  Typography, 
  Card, 
  Row, 
  Col, 
  Table, 
  Tag, 
  Space, 
  Descriptions,
  Alert,
  message
} from 'antd';
import {
  FileImageOutlined,
  FilePdfOutlined,
  EditOutlined,
  PrinterOutlined,
  DollarOutlined
} from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import moment from 'moment';
import './style.css';

// Import images
import corner from '../../assets/corner.png';
import logoimg from '../../assets/logo.webp';
import logo22land from '../../assets/22land.png';
import signature from '../../assets/signature.png';

const { Title, Text, Paragraph } = Typography;

const BookingConfirmation = ({ details, onEdit }) => {
  const { 
    rooms = [], 
    hotelName = '', 
    hotelAddress = '', 
    benefit = [], 
    logo = '', 
    deposit = 0, 
    bookerName = '',
    additionalServices = [] 
  } = details || {};

  const [totalAmount, setTotalAmount] = useState('0.00');
  const [totalDeposit, setTotalDeposit] = useState('0.00');
  const [totalRemaining, setTotalRemaining] = useState('0.00');
  const [totalServices, setTotalServices] = useState('0.00');
  const [roomTotal, setRoomTotal] = useState('0.00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateAmounts();
  }, [rooms, additionalServices, deposit]);

  // Tính toán tổng tiền
  const calculateAmounts = () => {
    let roomTotalAmount = 0;
    let serviceAmount = 0;
    
    // Tính tổng tiền phòng
    if (rooms && rooms.length > 0) {
      roomTotalAmount = rooms.reduce((total, room) => 
        total + (Number(room.amount) || 0), 0);
    }
    
    // Tính tổng tiền dịch vụ bổ sung
    if (additionalServices && additionalServices.length > 0) {
      serviceAmount = additionalServices.reduce((total, service) => 
        total + (Number(service.servicePrice) || 0), 0);
    }
    
    // Tổng tiền = phòng + dịch vụ
    const grandTotal = roomTotalAmount + serviceAmount;
    const depositAmount = Number(deposit) || 0;
    
    // Format tiền tệ với dấu phẩy ngăn cách hàng nghìn
    setRoomTotal(formatCurrency(roomTotalAmount));
    setTotalServices(formatCurrency(serviceAmount));
    setTotalAmount(formatCurrency(grandTotal));
    setTotalDeposit(formatCurrency(depositAmount));
    setTotalRemaining(formatCurrency(grandTotal - depositAmount));
  };

  // Format số thành dạng tiền tệ Việt Nam
  const formatCurrency = (value) => {
    return value.toLocaleString('vi-VN');
  };

  // Format ngày giờ
  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).format('DD/MM/YYYY HH:mm');
  };

  // Tính số ngày ở
  const calculateDays = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const start = moment(checkIn);
    const end = moment(checkOut);
    return end.diff(start, 'days') || 1; // Tối thiểu 1 ngày
  };

  // Xuất file PNG
  const exportToPNG = async () => {
    try {
      setLoading(true);
      const element = document.getElementById('booking-confirmation');
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = `booking-${hotelName}-${moment().format('DDMMYYYY')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      message.success('Xuất file PNG thành công!');
    } catch (error) {
      message.error('Lỗi khi xuất file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Xuất file PDF
  const exportToPDF = async () => {
    try {
      setLoading(true);
      const element = document.getElementById('booking-confirmation');
      const canvas = await html2canvas(element, { 
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`booking-${hotelName}-${moment().format('DDMMYYYY')}.pdf`);
      
      message.success('Xuất file PDF thành công!');
    } catch (error) {
      message.error('Lỗi khi xuất file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cấu hình cột cho bảng phòng
  const roomColumns = [
    {
      title: 'Tên khách',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div style={{whiteSpace: 'pre-wrap'}}>{text}</div>
    },
    {
      title: 'Loại phòng',
      dataIndex: 'roomType',
      key: 'roomType',
    },
    {
      title: 'Ngày đến',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      render: (date) => formatDateTime(date),
    },
    {
      title: 'Ngày đi',
      dataIndex: 'departureDate',
      key: 'departureDate',
      render: (date) => formatDateTime(date),
    },
    {
      title: 'Số đêm',
      key: 'nights',
      render: (_, record) => calculateDays(record.arrivalDate, record.departureDate)
    },
    {
      title: 'Giá/đêm',
      dataIndex: 'roomPrice',
      key: 'roomPrice',
      render: (price) => `${formatCurrency(Number(price))} VND`,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${formatCurrency(Number(amount))} VND`
    },
  ];

  // Cấu hình cột cho bảng dịch vụ
  const serviceColumns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Giá dịch vụ',
      dataIndex: 'servicePrice',
      key: 'servicePrice',
      render: (price) => `${formatCurrency(Number(price))} VND`
    }
  ];

  return (
    <>
      <Card 
        id="booking-confirmation"
        className="confirmation-container non-responsive-confirmation"
        bodyStyle={{ padding: '30px' }}
      >
        {/* Header */}
        <Row style={{ marginBottom: '20px' }} justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={8} sm={8} md={8} lg={8} xl={8}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              {logo === "22Housing" ? (
                <img src={logoimg} alt="22Housing Logo" style={{ width: '100px', height: 'auto' }} />
              ) : (
                <img src={logo22land} alt="22Land Logo" style={{ width: '150px', height: 'auto' }} />
              )}
            </div>
          </Col>
          <Col xs={16} sm={16} md={16} lg={16} xl={16} style={{ textAlign: 'right' }}>
            <Text strong style={{ display: 'block', fontSize: '18px', marginBottom: '4px' }}>
              22 LAND REAL ESTATE INVESTMENT CONSULTANCY
            </Text>
            <Text style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
              Address: {hotelAddress}
            </Text>
            <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
              Phone: 0866809239 - Email: sale05.22housing@gmail.com
              <br />
              Web: https://22landresidence.com, https://22housing.com
            </Text>
          </Col>
        </Row>

        <Divider>
          <Title level={2} className="confirmation-title">CONFIRMATION LETTER</Title>
        </Divider>

        {/* Guest Information */}
        <div className="confirmation-section">
          <Paragraph>
            Dear <Text strong>{bookerName || (rooms.length > 0 ? rooms[0].name : 'Guest')}</Text>,
            <br />
            Thank you for choosing <Text strong italic>{hotelName}</Text>.
            We are pleased to confirm your reservation details as follows:
          </Paragraph>
        </div>

        {/* Room Information */}
        <div className="confirmation-section">
          <Title level={4} className="confirmation-section-title">ROOM DETAILS</Title>
          <Table 
            columns={roomColumns} 
            dataSource={rooms.map((room, index) => ({ ...room, key: index }))} 
            pagination={false}
            size="middle"
            bordered
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>
                    <Text strong>Tổng tiền phòng</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>{roomTotal} VND</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>

        {/* Additional Services */}
        {additionalServices && additionalServices.length > 0 && (
          <div className="confirmation-section">
            <Title level={4} className="confirmation-section-title">ADDITIONAL SERVICES</Title>
            <Table 
              columns={serviceColumns} 
              dataSource={additionalServices.map((service, index) => ({ ...service, key: index }))} 
              pagination={false}
              size="middle"
              bordered
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text strong>Tổng tiền dịch vụ</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>{totalServices} VND</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        )}

        {/* Benefits */}
        <div className="confirmation-section">
          <Title level={4} className="confirmation-section-title">BENEFITS INCLUDED</Title>
          <ul style={{ marginLeft: '20px', color: '#333' }}>
            {benefit && benefit.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Payment Summary */}
        <div className="confirmation-section">
          <Title level={4} className="confirmation-section-title">PAYMENT SUMMARY</Title>
          <Row gutter={[24, 24]}>
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
              <Card style={{ borderColor: '#e8e8e8' }}>
                <Descriptions column={1} bordered size="default">
                  <Descriptions.Item label="Tổng tiền" labelStyle={{ fontWeight: 'bold' }}>
                    <Text strong>{totalAmount} VND</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Đã đặt cọc" labelStyle={{ fontWeight: 'bold' }}>
                    <Text type="success">{totalDeposit} VND</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Còn lại" labelStyle={{ fontWeight: 'bold' }}>
                    <Text type="danger">{totalRemaining} VND</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <img src={signature} alt="Authorized Signature" style={{ width: '120px', marginBottom: '10px' }} />
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>Phan Huyen Trang</div>
              </div>
            </Col>
            
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
              <Card style={{ height: '100%' }}>
                <Title level={5}>Booked and Payable by</Title>
                <Paragraph>
                  22 Land Real Estate Investment Consultancy
                  <br />
                  No 20 Linh Lang Street, Cong Vi Ward, Ba Dinh District, Hanoi
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Policies */}
        <div className="confirmation-section">
          <Title level={4} className="confirmation-section-title">ROOM RETENTION POLICY</Title>
          <ol style={{ marginLeft: '20px', color: '#333' }}>
            <li>Non-refundable - no cancellations</li>
            <li>
              Retention policy applies:
              <ul>
                <li>For 1-room bookings, the retention is valid if made at least 24 hours before check-in.</li>
                <li>For 2-room bookings or more, the retention is valid if made at least 72 hours before check-in.</li>
                <li>Retention is not applicable for groups booking 3 rooms or more.</li>
              </ul>
            </li>
            <li>For group bookings: No last-minute cancellations (a minimum 50% deposit is required).</li>
            <li>The retention period is 1 month from the scheduled check-in date, and the retention or date change can be made only once.</li>
          </ol>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e8e8e8', paddingTop: '20px' }}>
          <div style={{ flex: 3 }}>
            <Paragraph style={{ fontSize: '13px', marginBottom: '0' }}>
              For any enquiries or more information, please feel free to contact us. (+84) 866 809 239.
              <br />
              This booking is acknowledged by {hotelName}.
            </Paragraph>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Paragraph style={{ fontSize: '13px', marginBottom: '0' }}>
              Thanks and Best regards,
              <br />
              <strong>Huyen Trang (Ms.)</strong>
              <br />
              Sales Manager
            </Paragraph>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <Card className="confirmation-action-card">
        <Row justify="center" gutter={[16, 16]}>
          <Col>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={onEdit}
              size="large"
              className="confirmation-action-button"
            >
              Chỉnh sửa
            </Button>
          </Col>
          <Col>
            <Button 
              icon={<FileImageOutlined />} 
              onClick={exportToPNG}
              loading={loading}
              size="large"
              className="confirmation-action-button"
            >
              Xuất PNG
            </Button>
          </Col>
          <Col>
            <Button 
              icon={<FilePdfOutlined />} 
              onClick={exportToPDF}
              loading={loading}
              size="large"
              className="confirmation-action-button"
            >
              Xuất PDF
            </Button>
          </Col>
          <Col>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={() => window.print()}
              size="large"
              className="confirmation-action-button"
            >
              In
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default BookingConfirmation; 