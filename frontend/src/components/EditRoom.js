import React, { useEffect,  useState } from 'react';
import { Card, Form, Alert, Container, Button } from 'react-bootstrap';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar'
export default function Login() {
  const { id } = useParams();

  const [topicname, setTopicname] = useState('');
  const [roomname, setRoomname] = useState('');
  const [description, setDiscription] = useState('');
  const [roomid, setRoomId] = useState('');
  async function datafetch() {
    try {
      const res = await axios.get(`/room/${id}`);
      setRoomId(res.data.room._id);
      setRoomname(res.data.room.name);
      setTopicname(res.data.topicname);
      setDiscription(res.data.room.description);
    } catch (err) {
      console.log(err);
    }
  }

  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/room/${roomid}`, {
        name: roomname,
        topic: topicname,
        description: description,
      });
      if (res.data.status === 'success') {
        window.location.reload(navigate(`/`));
      }
    } catch (err) {
      setErr(err.response.data.message);
    }
  };

  useEffect(() => {
    datafetch();
  }, []); //eslint-disable-line

  return (
    <>
    <Navbar/>
      <Container
        style={{ minHeight: '100vh' }}
        className='d-flex justify-content-center align-items-center'
      >
        <div className='w-100' style={{ maxWidth: '350px' }}>
          <Card style={{ backgroundColor: '#51546e', borderRadius: '10px' }}>
           
              <h2 className='text-center mb-4' style={{
                background: ' #696d97',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                height: '3.3rem',
                color: '#e5e5e5',
                paddingTop: '4px',
              }}>Room Details </h2>
              <Card.Body>
              {err && <Alert variant='danger'>{err}</Alert>}
              <Form onSubmit={handlesubmit}>
                <Form.Group id='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type='text'
                    value={roomname}className='input-bar'
                    onChange={(e) => setRoomname(e.target.value)}
                  />
                </Form.Group>
                <Form.Group id='topic'>
                  <Form.Label>Topic</Form.Label>
                  <Form.Control
                    type='text'
                    value={topicname}className='input-bar'
                    onChange={(e) => setTopicname(e.target.value)}
                  />
                </Form.Group>
                <Form.Group id='description'>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as='textarea' rows='3'
                    value={description}className='input-bar'
                    onChange={(e) => setDiscription(e.target.value)}
                  />
                </Form.Group>

                <Button type='submit' className='w-100 mt-4 login-btn'>
                  Update Room
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
