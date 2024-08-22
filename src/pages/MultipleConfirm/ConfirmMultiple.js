import { Button, Divider } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';
import corner from '../../assets/corner.png';
import logoimg from '../../assets/logo.webp';
import logo22land from '../../assets/22land.png';
import signature from '../../assets/signature.png';
const BookingConfirmation = ({ details, onEdit }) => {
    const { rooms, hotelName, hotelAddress, benefit, logo, deposit, bookerName } = details;

    const [totalAmount, setTotalAmount] = React.useState(0);
    const [totalDeposit, setTotalDeposit] = React.useState(0);
    const [totalRemaining, setTotalRemaining] = React.useState(0);

    React.useEffect(() => {
        let total = 0;
        rooms.forEach((room) => {
            total += Number(room.amount);
        });
        const numDeposit = Number(deposit);
        // Định dạng totalAmount theo dạng 1,xxx,xxx.00
        const formattedTotal = total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedDeposit = numDeposit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const formattedRemaining = (total - numDeposit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        setTotalAmount(formattedTotal);
        setTotalDeposit(formattedDeposit);
        setTotalRemaining(formattedRemaining);
    }, [rooms]);

    const exportToPNG = () => {
        const element = document.getElementById('booking-content');
        html2canvas(element, { quality: 0.95 }).then((canvas) => {
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
                <div style={styles.headerSection}>
                    <p style={styles.companyInfo}>
                        <div style={styles.logo}>
                            {
                                logo == "22Housing" ?
                                    <img style={styles.logoImage} src={logoimg} alt="logo" /> :
                                    <img style={styles.logoImage22Land} src={logo22land} alt="logo" />
                            }
                        </div>
                        {/* {hotelName}<br /> */}
                        <div style={styles.address}>
                            Address: {hotelAddress}<br />
                        </div>
                        Phone: 0866809239 - Email: sale05.22housing@gmail.com - Web: https://22landresidence.com, https://22housing.com
                    </p>
                </div>
                <div style={styles.headerSection}>

                    <Divider variant="dashed" style={{ borderColor: '#333' }} dashed ><h2 style={styles.title}>CONFIRMATION LETTER</h2></Divider>
                </div>
                <div style={styles.section}>
                    Dear {bookerName? bookerName : rooms[0].name}, <br />
                    Thank you for choosing <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}> {hotelName}</span>. We are pleased to confirm your reservation details as follows:
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
                                <th style={styles.th}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room, index) => (
                                <tr key={index}>
                                    <td style={{ ...styles.td, whiteSpace: 'pre-wrap' }}>{room.name}</td>
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
                                    <td style={styles.td}>{Number(room.roomPrice).toLocaleString()} VND</td>
                                    <td style={styles.td}>{Number(room.amount).toLocaleString()} VND</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div style={styles.section}>
                    <h3 style={styles.subHeader}>BENEFITS INCLUDED</h3>
                    <ul style={styles.benefitsList}>
                        {/* <li>Daily housekeeping service</li>
                            <li>Buffet breakfast free</li>
                            <li>Daily complimentary 02 bottles of mineral water, tea & coffee in room</li>
                            <li>Complimentary Wi-Fi</li>
                            <li>Complimentary access to hotel facilities: Jacuzzi on 01st floor</li> */}
                        {benefit.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div style={styles.paymentSection}>
                    <div style={styles.paymentDetails}>
                        <div style={styles.netRate}>
                            <strong>Total Amount</strong>
                            <div style={styles.rateAmount}>VND {totalAmount}</div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Diposited</span>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', marginLeft: '10px', }}>VND {totalDeposit}</div>
                            </div>
                            {/* Còn lại  */}
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Remaining</span>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', marginLeft: '10px', }}>VND {totalRemaining}</div>
                            </div>
                        </div>
                        <div style={styles.signature}>
                            <img src={signature} alt="Authorized Signature" style={styles.signatureImage} />
                            <div style={styles.signatureText}>Phan Huyen Trang</div>
                        </div>
                        <div style={styles.bookedBy}>
                            <strong>Booked and Payable by</strong>
                            <div>
                                22 Land Real Estate Investment Consualtancy.
                                <br />
                                No 20 Linh Lang Street, Cong Vi Ward, Ba Dinh District, Hanoi
                            </div>
                        </div>
                    </div>
                    {/* <div style={styles.cardDetails}>
                        <table style={styles.cardTable}>
                            <thead>
                                <tr>
                                    <th style={styles.cardTh}>Card Type</th>
                                    <th style={styles.cardTh}>Card Number</th>
                                    <th style={styles.cardTh}>CVV-code</th>
                                    <th style={styles.cardTh}>Expiry Date</th>
                                    <th style={styles.cardTh}>Card Holder Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={styles.cardTd}>-</td>
                                    <td style={styles.cardTd}>-</td>
                                    <td style={styles.cardTd}>-</td>
                                    <td style={styles.cardTd}>-</td>
                                    <td style={styles.cardTd}>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div> */}
                    <div style={styles.upcInfo}>
                        {/* We look forward to welcoming you to {hotelName}. */}
                        For any enquiries or more information, please feel free to contact us. (+84) 866 809 239.
                    </div>
                    <div style={styles.acknowledgement}>
                        This booking is acknowledged by {hotelName}.
                    </div>
                </div>

                <div style={styles.section}>
                    {/* <h3 style={styles.subHeader}>GUARANTEE</h3>
                    <p style={styles.text}>
                        The room rate is guaranteed as the signed contract between the Company and the Hotel. <br />
                        It is recommended to guarantee the reservation by credit card, deposit by bank transfer or pre-payment as this will ensure the room is held until your arrival. <br />
                        A non-guaranteed booking will be released at 18:00 on the day of arrival.
                    </p>
                    <h3 style={styles.subHeader}>CANCELLATION, AMENDMENT, AND NO-SHOW POLICY</h3>
                    <p style={styles.text}>
                        Before 24 hours prior to arrival date: No charge.<br />
                        Within 24 hours prior to arrival date or No-show: Charged 1st night of all rooms reserved.
                    </p> */}
                    <h3 style={styles.subHeader}>ROOM RETENTION POLICY</h3>
                    1. Non-refundable - no cancellations <br />
                    2. Retention policy applies:
                    <ul style={{ margin: 0 }} >

                        <li>For 1-room bookings, the retention is valid if made at least 24 hours before check-in.</li>
                        <li>For 2-room bookings or more, the retention is valid if made at least 72 hours before check-in.</li>
                        <li>Retention is not applicable for groups booking 3 rooms or more.</li>
                    </ul>
                    3. For group bookings: No last-minute cancellations (a minimum 50% deposit is required). <br />
                    4. The retention period is 1 month from the scheduled check-in date, and the retention or date change can be made only once.
                    <div style={styles.footer}>
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
        margin: '10px auto',
        padding: '10px 30px',
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
    address: {
        fontSize: '14px',
        color: '#555',
        fontWeight: 'bold',
    },
    logoImage: {
        width: '100px',
        height: 'auto',
        marginBottom: '10px',
    },
    logoImage22Land: {
        width: '150px',
        height: 'auto',
        marginBottom: '10px',
    },
    headerSection: {
        textAlign: 'center',
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
        color: '#333',
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
        backgroundColor: '#555555',
        color: '#fff',
        verticalAlign: 'middle', // Align the text vertically in the middle
    },
    td: {
        border: '1px solid #ddd',
        padding: '12px',
        fontWeight: 'bold',
        color: '#555',
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
    footer: {
        width: '100%',
        //content is in the right
        display: 'flex',
        justifyContent: 'flex-end',
    },
    textFoot: {
        width: '200px',
        fontSize: '14px',
        fontWeight: 'bold',
        textAlign: 'center',
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
    paymentSection: {
        marginTop: '20px',
        marginBottom: '20px',
        border: '1px solid #333',
        padding: '10px',
        backgroundColor: '#f9f9f9',
    },
    paymentDetails: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    netRate: {
        flex: 1,
        padding: '10px',
        borderRight: '1px solid #333',
    },
    rateAmount: {
        marginTop: '10px',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    signature: {
        flex: 1,
        padding: '10px',
        textAlign: 'center',
        borderRight: '1px solid #333',
    },
    signatureText: {
        fontSize: '14px',
        color: '#555',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
    },
    signatureImage: {
        width: '100px',
        height: 'auto',
    },
    bookedBy: {
        flex: 1,
        padding: '10px',
    },
    cardDetails: {
        marginTop: '20px',
    },
    cardTable: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    cardTh: {
        border: '1px solid #333',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#e0e0e0',
    },
    cardTd: {
        border: '1px solid #333',
        padding: '8px',
        textAlign: 'left',
    },
    upcInfo: {
        marginTop: '20px',
        fontStyle: 'italic',
    },
    acknowledgement: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
};

export default BookingConfirmation;
