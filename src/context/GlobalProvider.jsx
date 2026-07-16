import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import {
  HOTEL_STORAGE_KEY,
  getDefaultHotelData,
  loadHotelData,
  normalizeHotelData,
  saveHotelData,
} from '../data/hotelStore';

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [bookingInfo, setBookingInfo] = useState({});
  const [hotelData, setHotelData] = useState(loadHotelData);

  const updateHotelData = (nextData) => {
    const savedData = saveHotelData(normalizeHotelData(nextData));
    setHotelData(savedData);
  };

  const resetHotelData = () => {
    const defaultData = getDefaultHotelData();
    window.localStorage.removeItem(HOTEL_STORAGE_KEY);
    setHotelData(defaultData);
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === HOTEL_STORAGE_KEY) {
        setHotelData(loadHotelData());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        bookingInfo,
        setBookingInfo,
        hotels: hotelData.hotels,
        roomTypes: hotelData.roomTypes,
        hotelData,
        updateHotelData,
        resetHotelData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const GlobalState = () => {
  return useContext(GlobalContext);
};

export default GlobalProvider;
