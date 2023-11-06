import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import './voucher.css';
import logo from '../assets/logo.png';
import { Button, FloatButton } from 'antd';
import { useTranslation } from 'react-i18next';
import { FileTextOutlined } from '@ant-design/icons';

const Voucher = () => {

    const { t } = useTranslation();

    //get state from InputForm 
    const [state, setState] = useState(() => {
        return window.history.state;
    });

    const [value, setValue] = useState();
    const [timeCheckIn, setTimeCheckIn] = useState('');
    const [timeCheckOut, setTimeCheckOut] = useState('');


    useState(() => {
        console.log(state);
        if (state && state.usr.checkinCheckout) {
            const timeCheckIn = state?.usr.checkinCheckout[0]['$d']
            const timeCheckOut = state?.usr.checkinCheckout[1]['$d']
            //Convert time to string format dd/mm/yyyy
            const dateCheckIn = timeCheckIn.toLocaleDateString() + ' ' + timeCheckIn.toLocaleTimeString();
            const dateCheckOut = timeCheckOut.toLocaleDateString() + ' ' + timeCheckOut.toLocaleTimeString();
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
                pdf.save("download.pdf");

            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    }




    return (
        <div >
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '50px',
            }}>
                <Button type="primary" onClick={() => window.history.back()}>Back</Button>
                <br />
                <br />
                {/* <Button type="primary" onClick={printDocument}>IN VOUCHER</Button> <br /> */}
                <br />
                <FloatButton
                    icon={<FileTextOutlined />}
                    description="EXPORT"
                    onClick={printDocument}
                    shape="square"
                    style={{ right: 24 }}
                />
                <FloatButton
                    description="HELP INFO"
                    shape="square"
                    style={{ right: 94 }}
                />
                <FloatButton
                    icon={<FileTextOutlined />}
                    description="HELP"
                    shape="square"
                    style={{ right: 164 }}
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
                position: 'absolute'
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
                    <div className='staff-info'>
                        <span> PHAN HUYỀN TRANG (Ms.) Sales Manager </span>
                        {/* mail  */}
                        <span>
                            <a href="mailto:" style={{ color: '#3E78BC' }}>
                                trangph22housing@gmail.com
                            </a>
                        </span>
                        {/* phone */}
                        <span>  (+84) 977125169</span>
                    </div>

                    <div className='voucher-info'>
                        <div>
                            <div className='client-container'>
                                <div className='client-info'>
                                    <h3>{t('content.clientInfo')}</h3>
                                    <h4>{t('content.clientName')} <strong> {value?.usr.name} </strong> </h4>
                                    {value?.usr?.email ? (<h4>{t('content.clientEmail')} <strong> {value?.usr.email} </strong> </h4>) : null}
                                    <h4>{t('content.clientPhone')}<strong> {value?.usr.phone} </strong></h4>
                                </div>

                            </div>

                            < div className='hotel-info'>
                                <h3>{t('content.hotelTitle')}</h3>
                                <h4>{t('content.hotelName')} <strong> {value?.usr.hotelName} </strong> </h4>
                                <h4>{t('content.hotelAddress')}  <strong> {value?.usr.hotelAddress} </strong> </h4>
                                <h4>Check In: <strong> {timeCheckIn} </strong></h4>
                                <h4>Check Out: <strong> {timeCheckOut} </strong></h4>
                                <h4>Check Out: <strong> {timeCheckOut} </strong></h4>
                                <h4 style={{ fontStyle: 'italic' }}>Hotline: 0765.10.2222</h4>
                            </div>
                        </div>
                        <div className='client-notification'>
                            <h2 style={{
                                color: 'red',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                // marginTop: '100px'
                                // position: 'absolute',
                                // top: '10px',
                                opacity: '0.7',
                                //nghiêng chữ 45 độ
                                // transform: 'rotate(-45deg)',
                                fontStyle: 'italic',

                            }}>
                                {/* Đặt dịch vụ thành công */}
                                {t('table.success')}
                            </h2>
                            {/* Vẽ table có border giữa các ô (không có header và mỗi dòng có ô title và mô tả) */}
                            <table style={{
                                borderCollapse: 'collapse',
                                width: '100%',
                                border: '1px solid black',
                                textAlign: 'center'
                            }}>
                                <tbody>
                                    <tr>
                                        <th style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px'
                                        }}>
                                            {t('table.code')}
                                        </th>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',
                                            color: 'red',
                                            fontWeight: 'bold'

                                        }}>
                                            {value?.usr.code}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {t('table.roomType')}
                                        </td>
                                        <td style={{
                                            border: '1px solid black',
                                            width: '50%',
                                            padding: '10px',

                                        }}>
                                            {value?.usr.roomType}
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
                                            {value?.usr.quantity}
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
                                            {value?.usr.totalPrice}
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
                                            {value?.usr.paymentInfo}
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
                                            {value?.usr.note}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
                <div className='footer'>
                    <div className='regulations'>
                        <h4>{t('regulations.title')}</h4>
                        <span className={"footer-text"}>{t('regulations.content1')}</span>
                        <span className={"footer-text"}>{t('regulations.content2')}</span>
                        <span className={"footer-text"}>{t('regulations.content3')}</span>
                        <span className={"footer-text"}>{t('regulations.content4')}</span>
                    </div>
                    <div className='policy'>
                        <h4>{t('policy.title')}</h4>
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

        </div>
    );
}


export default Voucher;