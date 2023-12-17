import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InputForm from '../pages/InputForm';
import Voucher from '../pages/Voucher';
import FacebookPage from '../pages/FacebookPage';

const CRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/voucher" element={<Voucher />} />
            <Route path="/facebook" element={<FacebookPage />} />
        </Routes>
    );
};

export default CRoutes;
