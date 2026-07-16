import defaultHotelData from './hotels.json';

export const HOTEL_STORAGE_KEY = 'website-confirm-booking:hotel-data:v1';

const clone = (value) => JSON.parse(JSON.stringify(value));

export const normalizeHotelData = (value) => {
  const source = Array.isArray(value) ? { hotels: value } : value || {};

  return {
    hotels: Array.isArray(source.hotels) ? source.hotels : [],
    roomTypes: Array.isArray(source.roomTypes) && source.roomTypes.length
      ? source.roomTypes
      : defaultHotelData.roomTypes,
  };
};

export const getDefaultHotelData = () => clone(normalizeHotelData(defaultHotelData));

export const loadHotelData = () => {
  if (typeof window === 'undefined') {
    return getDefaultHotelData();
  }

  try {
    const storedData = window.localStorage.getItem(HOTEL_STORAGE_KEY);
    return storedData
      ? normalizeHotelData(JSON.parse(storedData))
      : getDefaultHotelData();
  } catch (error) {
    console.warn('Không thể đọc dữ liệu khách sạn đã lưu, dùng dữ liệu mặc định.', error);
    return getDefaultHotelData();
  }
};

export const saveHotelData = (value) => {
  const nextData = normalizeHotelData(value);
  window.localStorage.setItem(HOTEL_STORAGE_KEY, JSON.stringify(nextData));
  return nextData;
};

export const parseImportedHotelData = (fileContent) => {
  const parsedData = typeof fileContent === 'string'
    ? JSON.parse(fileContent)
    : fileContent;
  const nextData = normalizeHotelData(parsedData);

  if (!nextData.hotels.length) {
    throw new Error('File JSON phải chứa ít nhất một khách sạn trong trường "hotels".');
  }

  return nextData;
};

export const downloadHotelData = (value) => {
  const blob = new Blob([JSON.stringify(normalizeHotelData(value), null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hotels-backup.json';
  link.click();
  URL.revokeObjectURL(url);
};
