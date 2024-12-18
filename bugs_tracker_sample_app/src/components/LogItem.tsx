import React from 'react';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Moment from 'react-moment';

import { DeleteLogItemType } from "../types/DeleteLogItemType"
import { LogItemType } from "../types/LogItemType"

function setVariant(priority: LogItemType["priority"]): string {
  switch (priority) {
    case 'high':
      return "danger";
    case 'moderate':
      return "warning";
    default:
      return "success";
  }
}

export function LogItem({ log: { _id, priority, text, user, created }, deleteItem }: { log: LogItemType, deleteItem: DeleteLogItemType }): React.JSX.Element {
  return (
    <tr>
      <td><Badge bg={setVariant(priority)} className="p-2">{priority.charAt(0).toUpperCase() + priority.slice(1)}</Badge></td>
      <td>{text}</td>
      <td>{user}</td>
      <td><Moment format="MMMM Do YYYY, h:mm:ss a">{new Date(created)}</Moment></td>
      <td><Button variant="danger" onClick={() => deleteItem(_id)}>X</Button></td>
    </tr>
  );
}

export default LogItem
