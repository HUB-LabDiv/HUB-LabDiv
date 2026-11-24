import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.usp.ifusp.hublabdiv',
  appName: 'HUB LabDiv',
  webDir: 'out',
  server: {
    url: 'https://www.hublabdiv.com.br/',
    cleartext: true,
    errorPath: 'offline.html',
    allowNavigation: [
      'www.hublabdiv.com.br',
      'hublabdiv.com.br',
      '*.hublabdiv.com.br',
      'hub-lab-div.vercel.app',
      '*.vercel.app',
      'localhost',
      '127.0.0.1'
    ]
  },
  appendUserAgent: 'LabDiv-App',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;