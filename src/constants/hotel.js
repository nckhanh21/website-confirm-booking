// Legacy compatibility exports. New code should read hotel data from GlobalState.
import hotelData from '../data/hotels.json';

export const hotelList = hotelData.hotels;
export const roomTypeList = hotelData.roomTypes;
