export const ENV = {
  appName: process.env.EXPO_PUBLIC_APP_NAME || 'ReactPOC',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com/v1',
  environment: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  version: '1.0.0',
};
