export const environment = {
  production: false,
  apiUrl: (typeof window !== 'undefined' && window.location.hostname.includes('github.io'))
    ? 'https://rasoisathi.onrender.com/api'
    : '/api'
};
