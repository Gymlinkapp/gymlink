import axios from 'axios';

export let URL =
  process.env.NODE_ENV === 'development'
    ? // ? process.env.DEV_API_URL
      // : process.env.PROD_API_URL;
      'http://10.0.1.198:3000'
    : 'https://gymlink-service.onrender.com';

const instance = axios.create({ baseURL: URL });
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
