import axios from 'axios';

export const { VITE_API_URL } = import.meta.env;

const instance = axios.create({
    baseURL: VITE_API_URL,
    // timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
  

export const setToken = (token) => {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
