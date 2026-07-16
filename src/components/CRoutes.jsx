import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const InputForm = lazy(() => import('../pages/OldConfirmation/InputForm'));
const Voucher = lazy(() => import('../pages/OldConfirmation/Voucher'));
const FacebookPage = lazy(() => import('../pages/OldConfirmation/FacebookPage'));
const VoucherChrismas = lazy(() => import('../pages/OldConfirmation/VoucherChrismas'));
const VoucherChrismas2 = lazy(() => import('../pages/OldConfirmation/VoucherChrismas2'));
const BookingConfirmationTest = lazy(() => import('../pages/OldConfirmation/ConfirmTest'));
const BookingManager = lazy(() => import('../pages/MultipleConfirm/BookingManager'));
const BookingManager2 = lazy(() => import('../pages/NewConfirmBooking/BookingManager'));

const CRoutes = () => (
    <Suspense fallback={<div>Đang tải...</div>}>
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
    </Suspense>
);

export default CRoutes;
