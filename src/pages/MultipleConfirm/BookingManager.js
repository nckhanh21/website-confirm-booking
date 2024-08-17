import React, { useState } from 'react';
import BookingInputForm from './BookingInputForm';
import BookingConfirmation from './ConfirmMultiple';

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
        <BookingConfirmation details={bookingDetails} onEdit={handleEditBooking} />
      )}
    </div>
  );
};

export default BookingManager;
