import { LogItemType } from "./LogItemType";

export type DeleteLogItemType = (id: LogItemType["_id"]) => void;
