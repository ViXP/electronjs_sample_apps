import { LogItemType } from "./LogItemType";

export interface BackendActionsInterface {
  logsLoad: () => void,
  logAdd: (log: LogItemType) => void,
  logRemove: (logId: LogItemType["_id"]) => void,
  logsReceived: (callback: (logs: LogItemType[]) => void) => void
}
