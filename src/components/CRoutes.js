import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InputForm from '../pages/InputForm';
import Voucher from '../pages/Voucher';
import FacebookPage from '../pages/FacebookPage';
import VoucherChrismas from '../pages/VoucherChrismas';
import VoucherChrismas2 from '../pages/VoucherChrismas2';
import BookingConfirmationTest from '../pages/ConfirmTest';
import BookingManager from '../pages/MultipleConfirm/BookingManager';

const CRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/voucher" element={<Voucher />} />
            <Route path="/voucher-chrismas" element={<VoucherChrismas />} />
            <Route path="/voucher-chrismas-2" element={<VoucherChrismas2 />} />
            <Route path="/facebook" element={<FacebookPage />} />
            <Route path="/test" element={<BookingConfirmationTest />} />
            <Route path="/input" element={<BookingManager />} />

        </Routes>
    );
};

export default CRoutes;
