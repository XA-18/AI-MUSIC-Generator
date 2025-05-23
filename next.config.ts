import { NextConfig } from 'next';

const config: NextConfig = {
  env: {
    STABILITY_API_KEY: process.env.STABILITY_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['http://localhost:3000']
    }
  },
};

export default config;
