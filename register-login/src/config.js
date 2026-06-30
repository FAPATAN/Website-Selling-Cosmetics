const API_URL =
  (process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://website-selling-cosmetics.onrender.com'
      : 'http://localhost:5000'))
    .replace(/\/$/, '');

export default API_URL;