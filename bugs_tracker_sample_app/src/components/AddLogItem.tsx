import React, { FormEventHandler, useState } from 'react'
import { Button, Card, Form, Row, Col } from 'react-bootstrap';

import { AddLogItemType } from "../types/AddLogItemType"
import { LogItemType } from "../types/LogItemType"

export function AddLogItem({ addItem }: { addItem: AddLogItemType}) {
  const [text, setText] = useState('');
  const [user, setUser] = useState('');
  const [priority, setPriority] = useState('low');

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    addItem({ text, user, priority } as LogItemType);
  }

  return (
    <Card className='mt-5 mb-3'>
      <Card.Body>
        <Form onSubmit={onSubmit}>
          <Row className="my-3">
            <Col>
              <Form.Control placeholder='Text' value={text} onChange={(e) => setText(e.target.value)} required />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Control placeholder='User' value={user} onChange={(e) => setUser(e.target.value)} required />
            </Col>
            <Col>
              <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value)} required>
                <option value="0">Select priority</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </Form.Control>
            </Col>
          </Row>
          <Row className='my-5'>
            <Col>
              <Button type="submit" variant="secondary" style={{width: "100%"}}>
                Save
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default AddLogItem