/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import fs from 'node:fs';
import path from 'node:path';
import { Menu, Tray, app, nativeImage } from 'electron';
import type { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import type { DesktopTransferItem } from './transfer-engine';

function resolveTrayIcon(): Electron.NativeImage {
  const relFile =
    process.platform === 'darwin'
      ? path.join('build', 'trayTemplate.png')
      : process.platform === 'win32'
        ? path.join('build', 'icon.ico')
        : path.join('build', 'tray.png');

  const candidates = [
    path.join(process.resourcesPath || '', 'app.asar.unpacked', relFile),
    path.join(app.getAppPath(), relFile),
    path.join(__dirname, '../../', relFile),
    path.join(process.resourcesPath || '', relFile),
  ];

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      const img = nativeImage.createFromPath(candidate);
      if (!img.isEmpty()) {
        if (process.platform === 'darwin') img.setTemplateImage(true);
        return img;
      }
    }
  }
  return nativeImage.createEmpty();
}

export interface TrayControllerOptions {
  isWindowsStore: boolean;
  getMainWindow: () => BrowserWindow | null;
  getTransfers: () => DesktopTransferItem[];
  onNavigateRoute: (route: string) => void;
  onQuickWater: () => void;
  onQuickEyeRest: () => void;
  onToggleHyperfocus: () => void;
  onCheckUpdates: () => void;
  onQuit: () => void;
}

export class DesktopTrayController {
  private tray: Tray | null = null;
  private readonly opts: TrayControllerOptions;

  constructor(opts: TrayControllerOptions) {
    this.opts = opts;
  }

  init(): void {
    if (this.tray) return;
    const icon = resolveTrayIcon();
    this.tray = new Tray(icon);
    this.tray.setToolTip('HUB LabDiv Desktop');
    this.tray.on('click', () => {
      this.focusMainWindow();
    });
    this.refreshMenu();
  }

  private focusMainWindow(): void {
    const win = this.opts.getMainWindow();
    if (win) {
      win.show();
      win.focus();
    }
  }

  private navigateAndFocus(route: string): void {
    this.focusMainWindow();
    this.opts.onNavigateRoute(route);
  }

  refreshMenu(): void {
    if (!this.tray) return;
    const transfers = this.opts.getTransfers();
    const active = transfers.filter(
      (t) => t.state === 'running' || t.state === 'finalizing' || t.state === 'queued'
    );
    const summaryLabel =
      active.length > 0
        ? `Transferências ativas: ${active.length} (${active[0].progressPercent}%)`
        : 'Armazenamento local ocioso';

    const template: MenuItemConstructorOptions[] = [
      {
        label: 'Abrir HUB LabDiv',
        click: () => this.focusMainWindow(),
      },
      { label: summaryLabel, enabled: false },
      { type: 'separator' },
      {
        label: 'Eixos do HUB',
        submenu: [
          { label: 'Comunidade / Social', click: () => this.navigateAndFocus('/') },
          { label: 'Informativo & CGIF', click: () => this.navigateAndFocus('/informativo') },
          { label: 'Ferramentas & Agenda', click: () => this.navigateAndFocus('/ferramentas') },
          { label: 'Lab Pessoal', click: () => this.navigateAndFocus('/lab') },
          { label: 'Show da Física', click: () => this.navigateAndFocus('/iniciativas/show-da-fisica') },
        ],
      },
      {
        label: 'Bem-Estar nos Estudos',
        submenu: [
          { label: '+1 Copo de Água', click: () => this.opts.onQuickWater() },
          { label: 'Iniciar Pausa Visual 20-20-20', click: () => this.opts.onQuickEyeRest() },
          { label: 'Alternar Modo Hiperfoco', click: () => this.opts.onToggleHyperfocus() },
        ],
      },
      { type: 'separator' },
    ];

    if (!this.opts.isWindowsStore) {
      template.push({
        label: 'Verificar atualizações',
        click: () => this.opts.onCheckUpdates(),
      });
    }

    template.push({
      label: 'Sair do HUB LabDiv',
      click: () => {
        this.opts.onQuit();
        app.quit();
      },
    });

    const menu = Menu.buildFromTemplate(template);
    this.tray.setContextMenu(menu);
  }

  destroy(): void {
    this.tray?.destroy();
    this.tray = null;
  }
}
