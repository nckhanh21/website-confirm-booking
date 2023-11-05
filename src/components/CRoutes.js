import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InputForm from '../pages/InputForm';
import Voucher from '../pages/Voucher';

const CRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/voucher" element={<Voucher />} />
        </Routes>
    );
};

export default CRoutes;
