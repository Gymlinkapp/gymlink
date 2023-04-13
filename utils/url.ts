export let URL =
  process.env.NODE_ENV === 'development'
    ? 'http://10.0.1.198:3000/api'
    : // 'https://localhost:3000/trpc'
      'https://gymlink-serverless.vercel.app/api';
// export let URL = 'https://gymlink-service.onrender.com';

export let CHAT_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://10.0.1.198:3001'
    : 'https://gymlink-service.onrender.com';
