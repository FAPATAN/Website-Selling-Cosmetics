const fallbackApiUrl = 'https://website-selling-cosmetics.onrender.com';

const normalizeApiUrl = (value) => {
  if (!value) return fallbackApiUrl;
  return value.trim().replace(/\/$/, '').replace(/\/api$/i, '');
};

const API_URL = normalizeApiUrl(
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? fallbackApiUrl : 'http://localhost:5000')
);

export default API_URL;