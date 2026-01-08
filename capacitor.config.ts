import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yatraplanner.app',
  appName: 'yatra-planner',
  webDir: 'dist/yatra-planner/browser',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '1067593356550-7140p4gto1b5qcs20ujuhf8po0enqgb4.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    }
  }
};

export default config;
