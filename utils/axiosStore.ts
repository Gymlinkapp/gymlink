import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://gymlink-service.onrender.com',
  baseURL: 'http://10.0.1.198:3000',
});
instance.interceptors.request.use((config) => {
  config.params = {
    // add your default ones
    // api_key: process.env.NEXT_PUBLIC_API_KEY,
    // spread the request's params
    ...config.params,
  };
  return config;
});
export default instance;
