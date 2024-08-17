import { Button, Divider } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';

const BookingConfirmation = ({ details, onEdit }) => {
    const { rooms, hotelName, hotelAddress } = details;

    const exportToPNG = () => {
        const element = document.getElementById('booking-content');
        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'booking-confirmation.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    };

    const exportToPDF = () => {
        const element = document.getElementById('booking-content');
        html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, 595.28, 841.89);
            pdf.save('booking-confirmation.pdf');
        });
    };

    return (
        <>
            <div id="booking-content" style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.headerSection}>
                        <p style={styles.companyInfo}>
                        <div style={styles.logo}>
                            <h1 style={{
                                color: '#F99D1C',
                                fontSize: '30px'
                            }}>22</h1>
                            <h1 style={{
                                color: '#3E78BC',
                                fontSize: '30px'

                            }}>Housing</h1>
                        </div>
                            {hotelName}<br />
                            Address: {hotelAddress}<br />
                            Phone: 0866809239 - Email: sale05.22housing@gmail.com - Web: https://22landresidence.com
                        </p>
                    </div>
                    <div style={styles.headerSection}>

                        <Divider variant="dashed" style={{ borderColor: '#333' }} dashed ><h2 style={styles.title}>CONFIRMATION LETTER</h2></Divider>
                    </div>
                    <div style={styles.section}>
                        Dear {rooms[0].name}, <br />
                        Thank you for choosing <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}> 22Land Residence Hotel</span>. We are pleased to confirm your reservation details as follows:
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.subHeader}>ROOM DETAILS</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Guest's Name</th>
                                    <th style={styles.th}>Room Type</th>
                                    <th style={styles.th}>Arrival Date</th>
                                    <th style={styles.th}>Departure Date</th>
                                    <th style={styles.th}>Price (per night)</th>
                                    <th style={styles.th}>Deposit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room, index) => (
                                    <tr key={index}>
                                        <td style={styles.td}>{room.name}</td>
                                        <td style={styles.td}>{room.roomType}</td>
                                        <td style={styles.td}>{new Date(room.arrivalDate).toLocaleString('en-GB', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}</td>
                                        <td style={styles.td}>{new Date(room.departureDate).toLocaleString('en-GB', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}</td>
                                        <td style={styles.td}>{room.roomPrice} VND</td>
                                        <td style={styles.td}>{room.deposit} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.subHeader}>BENEFITS INCLUDED</h3>
                        <ul style={styles.benefitsList}>
                            <li>Daily housekeeping service</li>
                            <li>Buffet breakfast free</li>
                            <li>Daily complimentary 02 bottles of mineral water, tea & coffee in room</li>
                            <li>Complimentary Wi-Fi</li>
                            <li>Complimentary access to hotel facilities: Jacuzzi on 01st floor</li>
                        </ul>
                    </div>

                    <div style={styles.section}>
                        <h3 style={styles.subHeader}>GUARANTEE</h3>
                        <p style={styles.text}>
                            The room rate is guaranteed as the signed contract between the Company and the Hotel. <br />
                            It is recommended to guarantee the reservation by credit card, deposit by bank transfer or pre-payment as this will ensure the room is held until your arrival. <br />
                            A non-guaranteed booking will be released at 18:00 on the day of arrival.
                        </p>
                        <h3 style={styles.subHeader}>CANCELLATION, AMENDMENT, AND NO-SHOW POLICY</h3>
                        <p style={styles.text}>
                            Before 24 hours prior to arrival date: No charge.<br />
                            Within 24 hours prior to arrival date or No-show: Charged 1st night of all rooms reserved.
                        </p>
                        <p style={styles.text}>
                            We look forward to welcoming you to 22 Land Residence Hotel.
                            For any enquiries or more information, please feel free to contact us.
                        </p>
                        <p style={styles.textFoot}>
                            Thanks and Best regards,<br />
                            Huyen Trang (Ms.)<br />
                            Sales Manager
                        </p>
                    </div>
                </div>

            </div>
            <div style={styles.buttonContainer}>
                <Button type="primary" onClick={onEdit} style={styles.editButton}>
                    Edit Booking
                </Button>
                <Button type="default" onClick={exportToPNG} style={styles.exportButton}>
                    Export to PNG
                </Button>
                <Button type="default" onClick={exportToPDF} style={styles.exportButton}>
                    Export to PDF
                </Button>
            </div>
        </>
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
    logo: {
        display: 'flex',
        justifyContent: 'center',
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
    th: {
        border: '1px solid #ddd',
        padding: '12px',
        fontSize: '14px',
        textAlign: 'left',
        fontWeight: 'bold',
        backgroundColor: '#007BFF',
        color: '#fff',
        verticalAlign: 'middle', // Align the text vertically in the middle
    },
    td: {
        border: '1px solid #ddd',
        padding: '12px',
        fontSize: '14px',
        textAlign: 'left',
        verticalAlign: 'middle', // Align the text vertically in the middle
    },
    benefitsList: {
        listStyleType: 'disc',
        paddingLeft: '20px',
        color: '#333',
    },
    text: {
        fontSize: '14px',
        color: '#555',
    },
    textFoot: {
        fontSize: '14px',
        fontWeight: 'bold',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
    },
    editButton: {
        marginRight: '10px',
    },
    exportButton: {
        marginLeft: '10px',
    },
};

export default BookingConfirmation;
