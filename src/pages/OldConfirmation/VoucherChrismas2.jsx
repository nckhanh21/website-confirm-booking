import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import '../styles/voucher.css';
import logo from '../../assets/logo-chrismas.png';
import { Button, FloatButton, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { GlobalState } from '../../context/GlobalProvider';

const VoucherChrismas2 = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { bookingInfo, setBookingInfo } = GlobalState();


    const columns = [
        {
            title: t('table.no'),
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: t('content.clientName'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: t('table.number'),
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: t('table.numberOfPeople'),
            dataIndex: 'numberOfPeople',
            key: 'numberOfPeople',
        },
        {
            title: 'Check In',
            dataIndex: 'checkIn',
            key: 'checkIn',
        },
        {
            title: 'Check Out',
            dataIndex: 'checkOut',
            key: 'checkOut',
        },
        {
            title: t('table.totalPayment'),
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: t('table.paymentInfo'),
            dataIndex: 'paymentInfo',
            key: 'paymentInfo',
        },
        {
            title: t('table.note'),
            dataIndex: 'note',
            key: 'note',
        },
    ];




    //get state from InputForm 
    const [state, setState] = useState(bookingInfo);

    const [value, setValue] = useState();
    const [timeCheckIn, setTimeCheckIn] = useState('');
    const [timeCheckOut, setTimeCheckOut] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log("intu", bookingInfo);
        console.log("intu", value);
        console.log("intu", timeCheckIn);
        console.log("intu", timeCheckOut);
        if (value) {
            setData([
                {
                    key: 1,
                    name: value.name,
                    quantity: value.quantity,
                    numberOfPeople: value.numberOfPeople,
                    checkIn: timeCheckIn,
                    checkOut: timeCheckOut,
                    totalPrice: value.totalPrice,
                    paymentInfo: value.paymentInfo,
                    note: value.note,
                }
            ])
        }
    }, [value, timeCheckIn, timeCheckOut]);

    useState(() => {
        console.log(state);
        if (state && state.checkinCheckout) {
            const timeCheckIn = state?.checkinCheckout[0]['$d']
            const timeCheckOut = state?.checkinCheckout[1]['$d']
            //Convert time to string format dd/mm/yyyy hh:mm  (ex: 01/01/2021 12:00 )  (giờ và phút phải có 2 chữ số)
            const dateCheckIn = `${timeCheckIn.getDate()}/${timeCheckIn.getMonth() + 1}/${timeCheckIn.getFullYear()} ${timeCheckIn.getHours()}:${timeCheckIn.getMinutes() < 10 ? '0' + timeCheckIn.getMinutes() : timeCheckIn.getMinutes()}`
            const dateCheckOut = `${timeCheckOut.getDate()}/${timeCheckOut.getMonth() + 1}/${timeCheckOut.getFullYear()} ${timeCheckOut.getHours()}:${timeCheckOut.getMinutes() < 10 ? '0' + timeCheckOut.getMinutes() : timeCheckOut.getMinutes()}`
            console.log(dateCheckIn);
            setTimeCheckIn(dateCheckIn);
            setTimeCheckOut(dateCheckOut);
        }
        setValue(state);
    }, [state]);



    const printDocument = () => {
        const input = document.getElementById('divToPrint');
        htmlToImage.toPng(input, { quality: 0.95 })
            .then((dataUrl) => {
                const pdf = new jsPDF('p', 'mm', 'a4');
                //get width and height of A4
                const width = pdf.internal.pageSize.getWidth();
                const height = pdf.internal.pageSize.getHeight();
                pdf.addImage(
                    dataUrl,
                    'PNG',
                    0,
                    0,
                    width,
                    height);
                pdf.save("voucher.pdf");

            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    }

    const printPng = () => {
        const input = document.getElementById('divToPrint');
        htmlToImage.toPng(input, { quality: 0.95 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'voucher.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    }

    const handleEdit = () => {
        navigate("/");
    }

    const handleBack = () => {
        setBookingInfo({});
        navigate("/");
    }


    return (
        <div >
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '50px',
            }}>
                <Button type="primary" onClick={handleBack}>Back</Button>
                <br />
                <br />
                {/* <Button type="primary" onClick={printDocument}>IN VOUCHER</Button> <br /> */}
                <br />
                <Button type="primary" onClick={handleEdit}>Sửa</Button>

                <FloatButton
                    icon={<FileTextOutlined />}
                    description="PDF"
                    onClick={printDocument}
                    shape="square"
                    style={{ right: 24, size: 'large' }}

                />
                <FloatButton
                    icon={<FileTextOutlined />}
                    description="ẢNH"
                    shape="square"
                    style={{ right: 94 }}
                    onClick={printPng}

                />
                <FloatButton
                    description="EDIT"
                    shape="square"
                    style={{ right: 164 }}
                    onClick={handleEdit}
                />
            </div>
            <div id="divToPrint" style={{
                backgroundColor: '#f5f5f5',
                width: '210mm',
                minHeight: '297mm',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundImage: `url(${logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                position: 'absolute',
                //background opacity

            }}>
                <div className='content'>
                    <div className='title' >
                        <h1 style={{
                            color: '#F99D1C'
                        }}>22</h1>
                        <h1 style={{
                            color: '#3E78BC'
                        }}>Housing</h1>

                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                        <div className='staff-info'>

                            <span> PHAN HUYỀN TRANG (Ms.) Sales Manager </span>
                            {/* mail  */}
                            <span>
                                <a href="mailto:" style={{ color: '#3E78BC' }}>
                                    sale05.22housing@gmail.com
                                </a>
                            </span>
                            {/* phone */}
                            <span>  (+84) 866809239</span>
                        </div>
                        <div className='staff-info' >

                            <span style={{ textAlign: 'center', fontWeight: '600', marginBottom: '.5em', fontSize: "1.2em" }}> {value?.hotelName}  </span>
                            {/* mail  */}
                            <span>
                                <strong>{t('content.hotelAddress')} </strong>
                                {value?.hotelAddress}
                            </span>
                            {/* phone */}
                            <span>
                                <a href="tel:" style={{ color: '#3E78BC' }}>
                                    Tel: (+84) 866809239
                                </a>
                            </span>
                        </div>
                    </div>

                    <div className='voucher-info'>
                        <Table style={{
                            width: '100%',
                            textAlign: 'center',
                        }} columns={columns} dataSource={data} pagination={false} />

                        {/* <div>
                            <div className='client-container'>
                                <div className='client-info'>
                                    <h3 className='info-title'>{t('content.clientInfo')}</h3>
                                    <h4>{t('content.clientName')} <strong> {value?.name} </strong> </h4>
                                    {value?.email ? (<h4>{t('content.clientEmail')} <strong> {value?.email} </strong> </h4>) : null}
                                    <h4>{t('content.clientPhone')}<strong> {value?.phone} </strong></h4>
                                </div>

                            </div>

                            < div className='hotel-info'>
                                <h3 className='info-title'>{t('content.hotelTitle')}</h3>
                                <h4>{t('content.hotelName')} <strong> {value?.hotelName} </strong> </h4>
                                <h4>{t('content.hotelAddress')}  <strong> {value?.hotelAddress} </strong> </h4>
                                <h4 >Hotline: <strong>0866809239</strong></h4>
                                <h4>Check In: <strong> {timeCheckIn} </strong></h4>
                                <h4>Check Out: <strong> {timeCheckOut} </strong></h4>
                            </div>
                        </div> */}
                        {/* <div className='client-notification'>
                            <h2 style={{
                                color: 'red',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                opacity: '0.7',
                                fontStyle: 'italic',
                                whiteSpace: 'nowrap',
                            }}>
                                {t('table.success')}
                            </h2>
                            <table style={{
                                borderCollapse: 'collapse',
                                width: '100%',
                                border: '1px solid black',
                                textAlign: 'center'
                            }}>
                                <tbody>
                                   
                                    <tr>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',
                                            fontWeight: 'bold'
                                        }}>
                                            {t('table.roomType')}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',
                                            color: 'red',
                                            fontWeight: 'bold'

                                        }}>
                                            {value?.roomType}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',
                                            
                                        }}>
                                            {t('table.number')}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {value?.quantity}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {t('table.totalPayment')}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {value?.totalPrice}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {t('table.paymentInfo')}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {value?.paymentInfo}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {t('table.note')}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',
                                            color: '#F99D1C',
                                            fontStyle: 'italic',
                                            fontSize: '14px',
                                        }}>
                                            {value?.note}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div> */}
                    </div>
                    <div className='staff-info'>
                    <span>
                       <strong> Dịch vụ kèm theo <br /></strong>
                    </span>
                    <span>
                        - Daily breakfast at Restaurant on 01st floor form 06.00am <br />
                        - Daily housekeeping service; <br />
                        - Daily complimentary 02 bottles of mineral water, tea & coffee in room; <br />
                        - Complimentary Wi-Fi;<br />
                        - Complimentary access to hotel facilities: Jacuzzi on 01st floor<br /> 
                    </span>
                    </div>
                    
                </div>
                <div className='footer'>
                    <div className='regulations'>
                        <span style={{ textAlign: 'center', fontWeight: '600', marginBottom: '.5em' }}>{t('regulations.title')}</span>
                        <span className={"footer-text"}>{t('regulations.content1')}</span>
                        <span className={"footer-text"}>{t('regulations.content2')}</span>
                        <span className={"footer-text"}>{t('regulations.content3')}</span>
                        <span className={"footer-text"}>{t('regulations.content4')}</span>
                        <span className={"footer-text"}>{t('regulations.content5')}</span>
                        <span className={"footer-text"}>{t('regulations.content6')}</span>
                        <span className={"footer-text"}>{t('regulations.content7')}</span>
                        <span className={"footer-text"}>{t('regulations.content8')}</span>
                    </div>
                    <div className='policy'>
                        <span style={{ textAlign: 'center', fontWeight: '600', marginBottom: '.5em' }}>{t('policy.title')}</span>
                        <span className={"footer-text"}>{t('policy.content1')}</span>
                        <span className={"footer-text"}>{t('policy.content2')}</span>
                        <span className={"footer-text"}>{t('policy.content3')}</span>
                        <span className={"footer-text"}>{t('policy.content4')}</span>
                    </div>
                    <div className='thank'>
                        <h4 style={{ color: "#3E78BC" }}>
                            {t('thank')} <br />
                        </h4>
                    </div>
                </div>
            </div>

        </div >
    );
}


export default VoucherChrismas2;