import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InputForm from '../pages/OldConfirmation/InputForm';
import Voucher from '../pages/OldConfirmation/Voucher';
import FacebookPage from '../pages/OldConfirmation/FacebookPage';
import VoucherChrismas from '../pages/OldConfirmation/VoucherChrismas';
import VoucherChrismas2 from '../pages/OldConfirmation/VoucherChrismas2';
import BookingConfirmationTest from '../pages/OldConfirmation/ConfirmTest';
import BookingManager from '../pages/MultipleConfirm/BookingManager';
import BookingManager2 from '../pages/NewConfirmBooking/BookingManager';

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
            <Route path="/new-input" element={<BookingManager2 />} />
        </Routes>
    );
};

export default CRoutes;
