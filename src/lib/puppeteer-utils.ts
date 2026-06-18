import fs from 'fs';

export function getLocalExecutablePath(): string {
    const paths = [
        // Windows
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        // Linux Native
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/microsoft-edge-stable',
        '/usr/bin/microsoft-edge',
        // MacOS
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ];

    for (const p of paths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }
    


    throw new Error('Nenhum navegador compatível (Chrome/Edge/Chromium) encontrado localmente. Instale o Google Chrome para testar a sincronização local.');
}
