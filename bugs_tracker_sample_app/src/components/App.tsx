import React, { useState, useEffect } from 'react'
import { Alert, Table, Container } from 'react-bootstrap';
import { LogItem } from './LogItem';
import { AddLogItem } from './AddLogItem';
import { LogItemType } from '../types/LogItemType';
import { AlertPayloadInterface } from '../types/AlertPayloadInterface';
import { DeleteLogItemType } from '../types/DeleteLogItemType';
import { AddLogItemType } from '../types/AddLogItemType';
import { BackendActionsInterface } from '../types/BackendActionsInterface';

declare const backendActions: BackendActionsInterface;

export function App(): React.JSX.Element {
  const [logs, setLogs] = useState([] as LogItemType[]);

  const [visualAlert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'success'
  } as AlertPayloadInterface);

  useEffect(()=> {
    backendActions.logsLoad();
    backendActions.logsReceived((newLogs: LogItemType[]) => setLogs(newLogs));
  }, []);

  const addItem: AddLogItemType = (item) => {
    backendActions.logAdd(item);
    showAlert("Log item is successfully added!");
  };

  const deleteItem: DeleteLogItemType = (itemId) => {
    if(confirm("Are you sure you want to remove it?")) {
      backendActions.logRemove(itemId);
      showAlert("Log item is removed!", "warning");
    }
  };

  const showAlert = (message: AlertPayloadInterface["message"], variant: AlertPayloadInterface["variant"] = 'success', seconds = 3): void => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant }), seconds * 1000)
  }

  return (
    <Container>
      <AddLogItem addItem={addItem} />
      {visualAlert.show && <Alert variant={visualAlert.variant}>{visualAlert.message}</Alert>}
      <Table>
        <thead>
          <tr>
            <th>Priority</th>
            <th>Log text</th>
            <th>User</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <LogItem key={log._id} log={log} deleteItem={deleteItem} />
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App
