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
  DollarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  RightOutlined
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
      render: (text) => (
        <Tag color="#1A3B6E" style={{ padding: '2px 10px', borderRadius: '4px' }}>
          {text}
        </Tag>
      )
    },
    {
      title: 'Ngày đến',
      dataIndex: 'arrivalDate',
      key: 'arrivalDate',
      render: (date) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: '5px', color: '#52c41a' }} />
          {formatDateTime(date)}
        </span>
      )
    },
    {
      title: 'Ngày đi',
      dataIndex: 'departureDate',
      key: 'departureDate',
      render: (date) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: '5px', color: '#ff4d4f' }} />
          {formatDateTime(date)}
        </span>
      )
    },
    {
      title: 'Số đêm',
      key: 'nights',
      render: (_, record) => (
        <Tag color="#108ee9" style={{ padding: '2px 10px', borderRadius: '4px' }}>
          {calculateDays(record.arrivalDate, record.departureDate)}
        </Tag>
      )
    },
    {
      title: 'Giá/đêm',
      dataIndex: 'roomPrice',
      key: 'roomPrice',
      render: (price) => (
        <span className="price-column">
          {formatCurrency(Number(price))} VND
        </span>
      )
    },
    {
      title: 'Thành tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="amount-column">
          {formatCurrency(Number(amount))} VND
        </span>
      )
    },
  ];

  // Cấu hình cột cho bảng dịch vụ
  const serviceColumns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text) => (
        <span style={{ fontWeight: '500' }}>
          <InfoCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          {text}
        </span>
      )
    },
    {
      title: 'Giá dịch vụ',
      dataIndex: 'servicePrice',
      key: 'servicePrice',
      render: (price) => (
        <span className="price-column">
          <CreditCardOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
          {formatCurrency(Number(price))} VND
        </span>
      )
    }
  ];

  return (
    <>
      <Card 
        id="booking-confirmation"
        className="confirmation-container non-responsive-confirmation premium-confirmation modern-confirmation"
        bodyStyle={{ padding: '25px' }}
      >
        {/* Decorative Elements */}
        <div className="confirmation-top-corner"></div>
        <div className="confirmation-bottom-corner"></div>
        
        {/* Header */}
        <div className="confirmation-header">
          <Row justify="space-between" align="middle">
            <Col span={8}>
              <div className="logo-container">
                {logo === "22Housing" ? (
                  <img src={logoimg} alt="22Housing Logo" className="company-logo" />
                ) : (
                  <img src={logo22land} alt="22Land Logo" className="company-logo" />
                )}
              </div>
            </Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Text strong className="company-name">
                22 LAND REAL ESTATE INVESTMENT CONSULTANCY
              </Text>
              <Text className="company-address">
                <EnvironmentOutlined style={{ marginRight: '5px' }} />
                {hotelAddress}
              </Text>
              <Text type="secondary" className="company-contact">
                Phone: 0866809239 - Email: sale05.22housing@gmail.com
                <br />
                Web: https://22landresidence.com, https://22housing.com
              </Text>
            </Col>
          </Row>
        </div>

        <Divider className="premium-divider">
          <span className="confirmation-title-line">—</span>
          <Title level={2} className="confirmation-title">CONFIRMATION LETTER</Title>
          <span className="confirmation-title-line">—</span>
        </Divider>

        {/* Guest Information */}
        <div className="confirmation-section">
          <div className="welcome-message">
            <UserOutlined className="welcome-icon" />
            <Paragraph className="greeting-text">
              Dear <Text strong>{bookerName || (rooms.length > 0 ? rooms[0].name : 'Guest')}</Text>,
              <br />
              Thank you for choosing <Text strong italic className="highlight-hotel">{hotelName}</Text>.
              We are pleased to confirm your reservation details as follows:
            </Paragraph>
          </div>
        </div>

        {/* Room Information */}
        <div className="confirmation-section compact-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="section-title-line"></div>
              <Title level={4} className="confirmation-section-title">ROOM DETAILS</Title>
            </div>
          </div>
          <Table 
            columns={roomColumns} 
            dataSource={rooms.map((room, index) => ({ ...room, key: index }))} 
            pagination={false}
            size="middle"
            bordered
            className="premium-table"
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={6}>
                    <Text strong>Tổng tiền phòng</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong className="total-amount">{roomTotal} VND</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>

        {/* Additional Services */}
        {additionalServices && additionalServices.length > 0 && (
          <div className="confirmation-section compact-section">
            <div className="section-header">
              <div className="section-title-wrapper">
                <div className="section-title-line"></div>
                <Title level={4} className="confirmation-section-title">ADDITIONAL SERVICES</Title>
              </div>
            </div>
            <Table 
              columns={serviceColumns} 
              dataSource={additionalServices.map((service, index) => ({ ...service, key: index }))} 
              pagination={false}
              size="middle"
              bordered
              className="premium-table"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text strong>Tổng tiền dịch vụ</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong className="total-amount">{totalServices} VND</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        )}

        {/* Benefits */}
        <div className="confirmation-section compact-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="section-title-line"></div>
              <Title level={4} className="confirmation-section-title">BENEFITS INCLUDED</Title>
            </div>
          </div>
          <div className="benefits-container">
            {benefit && benefit.map((item, index) => (
              <div key={index} className="benefit-item">
                <CheckCircleOutlined className="benefit-icon" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="confirmation-section compact-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="section-title-line"></div>
              <Title level={4} className="confirmation-section-title">PAYMENT SUMMARY</Title>
            </div>
          </div>
          <div className="payment-container">
            <Row justify="space-between" gutter={[30, 0]}>
              <Col span={12}>
                <div className="total-amount-card">
                  <div className="total-amount-title">Total Amount</div>
                  <div className="total-amount-value">VND {totalAmount}</div>
                  <div className="amount-details">
                    <div className="amount-row">
                      <span className="amount-label">Deposited</span>
                      <span className="deposit-value">VND {totalDeposit}</span>
                    </div>
                    <div className="amount-row">
                      <span className="amount-label">Remaining</span>
                      <span className="remaining-value">VND {totalRemaining}</span>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={7} className="text-center">
                <div className="signature-container">
                  <img src={signature} alt="Authorized Signature" className="signature-image" />
                  <div className="signature-name">Phan Huyen Trang</div>
                </div>
              </Col>
              
              <Col span={7}>
                <div className="payable-card">
                  <div className="payable-title">Booked and Payable by</div>
                  <div className="company-info">
                    22 Land Real Estate Investment Consultancy
                    <br />
                    No 20 Linh Lang Street, Cong Vi Ward, Ba Dinh District, Hanoi
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Policies */}
        <div className="confirmation-section compact-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="section-title-line"></div>
              <Title level={4} className="confirmation-section-title">ROOM RETENTION POLICY</Title>
            </div>
          </div>
          <div className="policy-container">
            <div className="policy-item">
              <span className="policy-number">1.</span>
              <span className="policy-text">Non-refundable - no cancellations</span>
            </div>
            
            <div className="policy-item">
              <span className="policy-number">2.</span>
              <div className="policy-content">
                <span className="policy-text">Retention policy applies:</span>
                <ul className="policy-sublist">
                  <li>For 1-room bookings, the retention is valid if made at least 24 hours before check-in.</li>
                  <li>For 2-room bookings or more, the retention is valid if made at least 72 hours before check-in.</li>
                  <li>Retention is not applicable for groups booking 3 rooms or more.</li>
                </ul>
              </div>
            </div>
            
            <div className="policy-item">
              <span className="policy-number">3.</span>
              <span className="policy-text">For group bookings: No last-minute cancellations (a minimum 50% deposit is required).</span>
            </div>
            
            <div className="policy-item">
              <span className="policy-number">4.</span>
              <span className="policy-text">The retention period is 1 month from the scheduled check-in date, and the retention or date change can be made only once.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="confirmation-footer">
          <div className="footer-content">
            <div className="footer-contact">
              <Paragraph className="footer-text">
                For any enquiries or more information, please feel free to contact us. (+84) 866 809 239.
                <br />
                This booking is acknowledged by {hotelName}.
              </Paragraph>
            </div>
            <div className="footer-signature">
              <Paragraph className="footer-text">
                Thanks and Best regards,
                <br />
                <strong>Huyen Trang (Ms.)</strong>
                <br />
                Sales Manager
              </Paragraph>
            </div>
          </div>
          <div className="footer-watermark">22LAND © {new Date().getFullYear()}</div>
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
              className="action-button edit-button"
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
              className="action-button export-png-button"
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
              className="action-button export-pdf-button"
            >
              Xuất PDF
            </Button>
          </Col>
          <Col>
            <Button 
              icon={<PrinterOutlined />} 
              onClick={() => window.print()}
              size="large"
              className="action-button print-button"
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