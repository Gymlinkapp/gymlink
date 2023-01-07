export let URL =
  process.env.NODE_ENV === 'development'
    ? // ? process.env.DEV_API_URL
      // : process.env.PROD_API_URL;
      'http://10.0.1.198:3000'
    : 'https://gymlink-service.onrender.com';
