import { useContext, useEffect, useState } from "react";
import { createContext } from "react";

const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const [bookingInfo, setBookingInfo] = useState({});
  return (
    <GlobalContext.Provider
      value={{
        bookingInfo,
        setBookingInfo,
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
