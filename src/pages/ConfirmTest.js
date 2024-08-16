import React from 'react';

const BookingConfirmation = ({ details }) => {
  const { rooms } = details;

  return (
    <div style={styles.container}>
      <div style={styles.headerSection}>
        <h2 style={styles.title}>XÁC NHẬN ĐẶT PHÒNG</h2>
        <p style={styles.companyInfo}>
          22 Land Residence 50 Trương Công Giai<br />
          Địa chỉ: 50 Trương Công Giai, Phường Dịch Vọng, Quận Cầu Giấy, TP Hà Nội<br />
          SĐT: - Email: 22landresidence50@gmail.com - Web: https://22landresidence.com
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subHeader}>CHI TIẾT CÁC PHÒNG</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Hạng phòng</th>
              <th>Ngày đến</th>
              <th>Ngày đi</th>
              <th>Giá phòng (1 đêm)</th>
              <th>Tiền cọc</th>
              <th>Phương thức thanh toán</th>
              <th>Yêu cầu đặc biệt</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index}>
                <td>{room.roomType}</td>
                <td>{new Date(room.arrivalDate).toLocaleString()}</td>
                <td>{new Date(room.departureDate).toLocaleString()}</td>
                <td>{room.roomPrice} VND</td>
                <td>{room.deposit} VND</td>
                <td>{room.paymentMethod}</td>
                <td>{room.specialRequests || 'Không có'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subHeader}>CHÍNH SÁCH BẢO LƯU PHÒNG</h3>
        <p style={styles.text}>
          - Không hoàn - hủy đặt phòng<br />
          - Áp dụng bảo lưu:<br />
          + Khách book 1 phòng được bảo lưu trước 24h check in<br />
          + Khách book 2 phòng trở lên bảo lưu trước 72h check in.<br />
          + Không áp dụng bảo lưu với đoàn từ 03 phòng<br />
          - Đối với khách đoàn: Không hủy ngang (cọc ít nhất 50%)<br />
          - Thời gian bảo lưu 1 tháng kể từ ngày lịch check in, bảo lưu hoặc đổi ngày tối đa 01 lần.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '800px',
    margin: '20px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    backgroundColor: '#fff',
  },
  headerSection: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    color: '#333',
  },
  companyInfo: {
    fontSize: '12px',
    color: '#555',
  },
  section: {
    marginBottom: '20px',
  },
  subHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    margin: '0 0 10px 0',
    color: '#007BFF',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '10px',
    border: '1px solid #ddd',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
  },
  th: {
    border: '1px solid #ddd',
    padding: '8px',
    fontSize: '14px',
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f7f7f7',
  },
  td: {
    border: '1px solid #ddd',
    padding: '8px',
    fontSize: '14px',
    textAlign: 'center',
  },
  text: {
    fontSize: '12px',
    color: '#555',
  },
};

export default BookingConfirmation;
