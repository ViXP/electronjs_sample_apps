import { ipcRenderer, contextBridge } from 'electron';
import { BackendActionsInterface } from './types/BackendActionsInterface';
import { LogItemType } from './types/LogItemType';

const backendActions: BackendActionsInterface = {
  logsLoad: () => ipcRenderer.send("logs:load"),
  logAdd: (log) => ipcRenderer.send("logs:add", log),
  logRemove: (logId) => ipcRenderer.send("logs:remove", logId),
  logsReceived: (callbackFunction) => ipcRenderer.on("logs:loaded", (_event, logsString: string) => callbackFunction(JSON.parse(logsString) as LogItemType[]))
}

contextBridge.exposeInMainWorld("backendActions", backendActions)
