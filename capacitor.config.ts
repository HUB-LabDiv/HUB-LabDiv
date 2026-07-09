import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.usp.ifusp.hublabdiv',
  appName: 'HUB LabDiv',
  webDir: 'out',
  server: {
    url: 'https://hublabdivapp-gules.vercel.app',
    cleartext: true
  }
};

export default config;
