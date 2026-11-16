// Brücke zwischen Oberfläche und Hauptprozess. Nur diese Funktionen sind erreichbar.
const { contextBridge, ipcRenderer } = require('electron');
const call = (ch) => (...args) => ipcRenderer.invoke(ch, ...args);
contextBridge.exposeInMainWorld('gymi', {
  storeRead: call('store:read'),
  storeWrite: call('store:write'),
  storeDelete: call('store:delete'),
  storeList: call('store:list'),
  fileSave: call('file:save'),
  fileOpen: call('file:open'),
  examStatus: call('exam:status'),
  examDownload: call('exam:download'),
  examImport: call('exam:import'),
  examOpen: call('exam:open'),
  openExternal: call('open:external'),
  openDataFolder: call('open:datafolder'),
  webFetch: call('web:fetch'),
  ltCheck: call('lt:check'),
  spellCheck: call('spell:check'),
  appInfo: call('app:info'),
  setBusy: call('app:busy'),
  backupList: call('backup:list'),
  backupRead: call('backup:read'),
  printPdf: call('print:pdf')
});
