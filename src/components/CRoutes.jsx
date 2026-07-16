import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

const HotelManagement = lazy(() => import('../pages/HotelManagement/HotelManagement'));
const BookingManager = lazy(() => import('../pages/MultipleConfirm/BookingManager'));
const LegacyInputForm = lazy(() => import('../pages/OldConfirmation/InputForm'));
const Voucher = lazy(() => import('../pages/OldConfirmation/Voucher'));
const LegacyFacebookPage = lazy(() => import('../pages/OldConfirmation/FacebookPage'));
const VoucherChrismas = lazy(() => import('../pages/OldConfirmation/VoucherChrismas'));
const VoucherChrismas2 = lazy(() => import('../pages/OldConfirmation/VoucherChrismas2'));
const BookingConfirmationTest = lazy(() => import('../pages/OldConfirmation/ConfirmTest'));
const LegacyBookingManager = lazy(() => import('../pages/NewConfirmBooking/BookingManager'));

const CRoutes = () => (
    <Suspense fallback={<div>Đang tải...</div>}>
        <Routes>
            <Route path="/" element={<BookingManager />} />
            <Route path="/input" element={<BookingManager />} />
            <Route path="/admin/hotels" element={<HotelManagement />} />
            <Route path="/legacy/input" element={<LegacyInputForm />} />
            <Route path="/legacy/voucher" element={<Voucher />} />
            <Route path="/legacy/voucher-chrismas" element={<VoucherChrismas />} />
            <Route path="/legacy/voucher-chrismas-2" element={<VoucherChrismas2 />} />
            <Route path="/legacy/facebook" element={<LegacyFacebookPage />} />
            <Route path="/legacy/test" element={<BookingConfirmationTest />} />
            <Route path="/legacy/new-input" element={<LegacyBookingManager />} />
            <Route path="/voucher" element={<Navigate replace to="/legacy/voucher" />} />
            <Route path="/voucher-chrismas" element={<Navigate replace to="/legacy/voucher-chrismas" />} />
            <Route path="/voucher-chrismas-2" element={<Navigate replace to="/legacy/voucher-chrismas-2" />} />
            <Route path="/facebook" element={<Navigate replace to="/legacy/facebook" />} />
            <Route path="/test" element={<Navigate replace to="/legacy/test" />} />
            <Route path="/new-input" element={<Navigate replace to="/legacy/new-input" />} />
        </Routes>
    </Suspense>
);

export default CRoutes;
