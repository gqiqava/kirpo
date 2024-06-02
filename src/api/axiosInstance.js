import axios from 'axios';

const commonConfig = {
  baseURL: 'http://192.168.10.5:8000/newapi/',
  headers: {
    'Content-Type': 'application/json'
  }
};

const requestInterceptorCallback = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
};

const AxiosInst = axios.create(commonConfig);

AxiosInst.interceptors.request.use(requestInterceptorCallback, (error) => {
  console.log('Request error', error);
  return Promise.reject(error);
});

AxiosInst.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Response error', error);
    return Promise.reject(error);
  }
);

export default AxiosInst;
