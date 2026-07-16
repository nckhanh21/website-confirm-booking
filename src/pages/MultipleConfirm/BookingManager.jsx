import { lazy, Suspense, useState } from 'react';
import BookingInputForm from './BookingInputForm';
import ClassicConfirmation from './ConfirmMultiple';

const ModernConfirmation = lazy(() => import('./ConfirmModern'));

const BookingManager = () => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleFormSubmit = (values) => {
    setBookingDetails(values);
    setIsEditing(false);
  };

  const handleEditBooking = () => {
    setIsEditing(true);
  };

  return (
    <div>
      {!bookingDetails || isEditing ? (
        <BookingInputForm onSubmit={handleFormSubmit} initialValues={bookingDetails} />
      ) : (
        bookingDetails.template === 'modern' ? (
          <Suspense fallback={<div>Đang tải mẫu xác nhận...</div>}>
            <ModernConfirmation details={bookingDetails} onEdit={handleEditBooking} />
          </Suspense>
        ) : (
          <ClassicConfirmation details={bookingDetails} onEdit={handleEditBooking} />
        )
      )}
    </div>
  );
};

export default BookingManager;
