import { useMemo, useState } from 'react';
import {
  ApartmentOutlined,
  BankOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import logo22land from '../../assets/22land.png';
import logo22housing from '../../assets/logo.webp';
import signature from '../../assets/signature.png';
import { exportConfirmationToPDF, exportConfirmationToPNG } from './exportConfirmation';
import './ConfirmModern.css';

const DOCUMENT_ID = 'booking-content-modern';

const formatCurrency = (value, decimals = 0) => Number(value || 0).toLocaleString('en-US', {
  minimumFractionDigits: decimals,
  maximumFractionDigits: decimals,
});

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
};

const ConfirmModern = ({ details, onEdit }) => {
  const [exporting, setExporting] = useState('');
  const {
    rooms = [],
    hotelName,
    hotelAddress,
    benefit = [],
    logo,
    deposit,
    bookerName,
    additionalServices = [],
  } = details;

  const totals = useMemo(() => {
    const roomTotal = rooms.reduce((sum, room) => sum + (Number(room.amount) || 0), 0);
    const serviceTotal = additionalServices.reduce(
      (sum, service) => sum + (Number(service.servicePrice) || 0),
      0,
    );
    const grandTotal = roomTotal + serviceTotal;
    return { roomTotal, serviceTotal, grandTotal, remaining: grandTotal - (Number(deposit) || 0) };
  }, [additionalServices, deposit, rooms]);

  const handleExport = async (type) => {
    setExporting(type);
    try {
      if (type === 'png') {
        await exportConfirmationToPNG(DOCUMENT_ID, 'booking-confirmation-contemporary.png');
      } else {
        await exportConfirmationToPDF(DOCUMENT_ID, 'booking-confirmation-contemporary.pdf');
      }
    } catch (error) {
      message.error(error.message || 'Không thể export booking.');
    } finally {
      setExporting('');
    }
  };

  return (
    <div className="modern-confirmation-page">
      <article id={DOCUMENT_ID} className="modern-confirmation">
        <header className="modern-document-header">
          <img
            src={logo === '22Housing' ? logo22housing : logo22land}
            alt={hotelName || '22Housing'}
            className={logo === '22Housing' ? 'modern-main-logo housing' : 'modern-main-logo'}
          />
          <div className="modern-gold-rule"><span>◆</span></div>
          <div className="modern-address"><EnvironmentOutlined /> {hotelAddress}</div>
          <div className="modern-contact-row">
            <span><PhoneOutlined /> 0866809239</span>
            <i />
            <span><MailOutlined /> sale05.22housing@gmail.com</span>
            <i />
            <span><GlobalOutlined /> https://22landresidence.com, https://22housing.com</span>
          </div>
        </header>

        <div className="modern-title-rule">
          <span />
          <h1>CONFIRMATION LETTER</h1>
          <span />
        </div>

        <section className="modern-greeting">
          <strong>Dear {bookerName || rooms[0]?.name || 'Guest'},</strong>
          <p>Thank you for choosing <b>{hotelName}</b>. We are pleased to confirm your reservation details as follows:</p>
        </section>

        <section className="modern-document-section">
          <h2><ApartmentOutlined /> ROOM DETAILS</h2>
          <div className="modern-heading-line" />
          <table className="modern-room-table">
            <thead>
              <tr>
                <th>Guest&apos;s Name</th>
                <th>Room Type</th>
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Price (per night)</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={`${room.name || 'guest'}-${index}`}>
                  <td>{room.name || '-'}</td>
                  <td>{room.roomType || '-'}</td>
                  <td>{formatDate(room.arrivalDate)}</td>
                  <td>{formatDate(room.departureDate)}</td>
                  <td>{formatCurrency(room.roomPrice)} VND</td>
                  <td>{formatCurrency(room.amount)} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="modern-document-section modern-benefits-section">
          <h2><CheckCircleOutlined /> BENEFITS INCLUDED</h2>
          <div className="modern-heading-line" />
          <ul className="modern-benefits-list">
            {benefit.map((item, index) => <li key={`${item}-${index}`}><CheckCircleOutlined /> {item}</li>)}
          </ul>
        </section>

        <section className="modern-payment-box">
          <div className="modern-payment-column modern-total-column">
            <h3><DollarOutlined /> <span>Total Amount</span></h3>
            <strong>VND {formatCurrency(totals.grandTotal, 2)}</strong>
            {totals.serviceTotal > 0 && <strong className="modern-secondary-total">VND {formatCurrency(totals.roomTotal, 2)}</strong>}
            <div><b>Deposited</b><span>VND {formatCurrency(deposit, 2)}</span></div>
            <div><b>Remaining</b><span>VND {formatCurrency(totals.remaining, 2)}</span></div>
          </div>
          <div className="modern-payment-column modern-signature-column">
            <img src={signature} alt="Authorized signature" />
            <div className="modern-gold-rule"><span>◆</span></div>
            <strong>Phan Huyen Trang</strong>
          </div>
          <div className="modern-payment-column modern-payable-column">
            <h3><BankOutlined /> <span>Booked and Payable by</span></h3>
            <p>22 Land Real Estate Investment Consultancy.<br />No 20 Linh Lang Street, Cong Vi Ward, Ba Dinh District, Hanoi</p>
          </div>
        </section>

        <div className="modern-contact-note"><PhoneOutlined /> <i>For any enquiries or more information, please feel free to contact us. (+84) 866 809 239.</i></div>
        <div className="modern-acknowledgement"><SafetyOutlined /> <strong>This booking is acknowledged by {hotelName}.</strong></div>

        <section className="modern-policy-section">
          <h2><SafetyOutlined /> ROOM RETENTION POLICY</h2>
          <div className="modern-heading-line" />
          <ol>
            <li>Non-refundable - no cancellations</li>
            <li>Retention policy applies:
              <ul>
                <li>For 1-room bookings, the retention is valid if made at least 24 hours before check-in.</li>
                <li>For 2-room bookings or more, the retention is valid if made at least 72 hours before check-in.</li>
                <li>Retention is not applicable for groups booking 3 rooms or more.</li>
              </ul>
            </li>
            <li>For group bookings: No last-minute cancellations (a minimum 50% deposit is required).</li>
            <li>The retention period is 1 month from the scheduled check-in date, and the retention or date change can be made only once.</li>
          </ol>
        </section>

        <footer className="modern-document-footer">
          <strong>Thanks and Best regards,</strong>
          <strong>Huyen Trang (Ms.)</strong>
          <b>Sales Manager</b>
          <div className="modern-gold-rule"><span>◆</span></div>
        </footer>
      </article>

      <Space wrap className="modern-actions">
        <Button onClick={onEdit}>Edit booking</Button>
        <Button loading={exporting === 'png'} onClick={() => handleExport('png')}>Export PNG</Button>
        <Button type="primary" loading={exporting === 'pdf'} onClick={() => handleExport('pdf')}>Export PDF</Button>
      </Space>
    </div>
  );
};

export default ConfirmModern;
