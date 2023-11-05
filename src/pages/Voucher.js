import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import './voucher.css';
import logo from '../assets/logo.png';
import { Button } from 'antd';

const Voucher = () => {

    //get state from InputForm 
    const [state, setState] = useState(() => {
        return window.history.state;
    });

    const [value , setValue] = useState();
    

    useState(() => {
        console.log(state);
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
                Cậu nhấn vào nút Download để tải file về nhé  <br />
                <Button type="primary" onClick={printDocument}>Download</Button> <br />
                Tớ xin lỗi cậu nhiều !! 
                Tớ không ngủ được  <br />
                Yêu cậu.. Xin lỗi cậu
                <br /> <br />
                Nút back về trang trước đây nè cậu <br />
                <Button type="primary" onClick={() => window.history.back()}>Back</Button>
                
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
                        <h4>Staff Name: <strong> PHAN HUYỀN TRANG (Ms.) Sales Manager</strong> </h4>
                        <h4>Staff Email: <strong>  phan.huyen.trang.0308@gmail.com </strong> </h4>
                        <h4>Staff Phone:<strong>  (+84) 977125169 </strong></h4>
                    </div>


                    <div className='client-container'>
                        <div className='client-info'>
                            <h3>Client Information</h3>
                            <h4>Client Name: <strong> {value?.usr.name} </strong> </h4>
                            <h4>Client Email: <strong> {value?.usr.email} </strong> </h4>
                            <h4>Client Phone:<strong> {value?.usr.phone} </strong></h4>
                        </div>
                        <div className='client-notification'>
                            <h2 style={{
                                color: 'red',
                                fontSize: '25px',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginTop: '100px'

                            }}>
                                {/* Đặt dịch vụ thành công */}
                                SERVICE BOOKING SUCCESSFUL
                            </h2>

                        </div>
                    </div>

                    < div className='hotel-info'>
                        <h3>Hotel Information</h3>
                        <h4>Hotel Name: <strong> {value?.usr.hotelName} </strong> </h4>
                        <h4>Hotel Address: <strong> {value?.usr.hotelAddress} </strong> </h4>

                    </div>
                </div>
                <div className='footer'>
                    <div className='regulations'>
                        <h3>Quy định tại khách sạn/căn hộ </h3>
                        <h4>1. Sử dụng căn hộ đúng mục đích để ở, không sử dụng chất kích thích, bay lắc,... tại căn hộ. Nếu cố tình CA phường hoặc ban quản lý trực tiếp lên xử lý. </h4>
                        <h4>2.  Hạn chế làm ồn sau 22h, ảnh hưởng đến mọi người xung quanh. </h4>
                        <h4>3. Đảm bảo giữ gìn đồ đạc trong căn hộ, có bất cứ vấn đề nào báo ngay cho host.  </h4>
                        <h4>4. Check out để thẻ tại bàn trong căn hộ, đóng cửa cẩn thận, báo host là đã check out.</h4>
                    </div>
                    <div className='policy'>
                        <h3>Chính sách Bảo lưu phòng</h3>
                        <h4>- Nếu khách Hủy phòng : Sẽ không được nhận lại số tiền đã đặt. </h4>
                        <h4>- Khách có thể bảo lưu hoặc đổi ngày trước 48h ( 02 ngày ) kể từ ngày check in, Không áp dụng bảo lưu với đoàn từ 03p trở lên.</h4>
                        <h4>- Đối với khách đoàn : Không hủy ngang ( cọc ít nhất 50%) </h4>
                        <h4>- Thời gian bảo lưu 1 tháng kể từ ngày lịch check in, bảo lưu hoặc đổi ngày tối đa 01 lần.</h4>
                    </div>
                </div>
            </div>

        </div>
    );
}


export default Voucher;