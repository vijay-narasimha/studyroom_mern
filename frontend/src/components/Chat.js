import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Stack, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
export default function Chat() {
  const localuser = JSON.parse(localStorage.getItem('profile')) || '';

  const navigate = useNavigate();
  const { id } = useParams();
  const [room, setRoom] = useState({});
  const [topic, setTopic] = useState();
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [roommessages, setRoommessages] = useState([]);

  async function datafetch() {
    try {
      const res = await axios.get(`/room/${id}`);

      setRoom(res.data.room);

      setUser(res.data.user);
      setTopic(res.data.topicname);
      setRoommessages(res.data.messages);
    } catch (err) {
      console.log(err);
    }
  }

  const handleJoin = async () => {
    await axios.get(`/participants/${id}`);
    window.location.reload();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await axios.delete(`/room/${room._id}`);
    window.location.reload(navigate('/'));
  };

  useEffect(() => {
   
    datafetch();
    connecttows();
  }, []);
  function timeSince(date) {
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (Math.floor(interval) === 1) return Math.floor(interval) + ' hour ago';
      return Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
  }

  const messagegroup = roommessages.map((message, index) => {
    return (
      <div
        key={index}
        style={{
          borderLeft: '2px solid #51546c',
          paddingLeft: '1rem',
          marginBottom: '.7rem',
        }}
      >
        <div className='d-flex justify-content-between'>
          <div style={{ color: '#71c6dd' }}>{message.user}</div>
          <div>{timeSince(message.createdAt)}</div>
        </div>
        <div>{message.message}</div>
      </div>
    );
  });

  function timeSince(date) {
    var seconds = Math.floor((new Date() - new Date(date)) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      if (Math.floor(interval) == 1) return Math.floor(interval) + ' hour ago';

      return Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
  }

  function connecttows() {
    const ws = new WebSocket('ws://localhost:5000');
    setWs(ws);
    ws.addEventListener('message', handleservermessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        connecttows();
      }, 1000);
    });
  }

  function handleservermessage(e) {
    const data = JSON.parse(e.data);
    setRoommessages((prev) => [...prev, { ...data }]);
  }
  function handlemessage(e) {
    e.preventDefault();
    if (message) {
      var obj = {
        message: message,
        room: room._id,
        user: localuser.name,
      };
      ws.send(JSON.stringify(obj));
    }
    setMessage('');
  }

  return (
    <>
      <Container>
        <Card style={{ backgroundColor: '#51546e' }}>
          <Stack
            direction='horizontal'
            gap={3}
            style={{
              backgroundColor: '#696d97',
              height: '45px',
              padding: '.4rem .9rem',
            }}
          >
            <a href='/'>
              <FontAwesomeIcon icon={faArrowLeft} />
            </a>
            <h5 style={{ color: '#e5e5e5', padding: '9px 0' }}>Study Room</h5>
            {localuser._id === user._id && (
              <>
                <a className='ms-auto' href={`/edit-room/${room.slug}`}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </a>
                <a
                  onClick={handleShow}
                  style={{ cursor: 'pointer', color: ' #71c6dd' }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </a>
              </>
            )}
          </Stack>
          <Card.Body>
            <Container>
              <div className='d-flex justify-content-between'>
                <h2>{room.name}</h2>
                <p>{timeSince(room.createdAt)}</p>
              </div>
              <div>
                <p>Hosted by:</p>
                <a href={`/userprofile/${user.name}`}>


              
                <div className='d-flex'>
                  {' '}
                  <img
                    src={`http://localhost:5000/${user.photo}`}
                    style={{
                      width: '5%',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      border: '2px solid #71c6dd',
                    }}
                  />
                  <div
                    className='me-auto px-2 pt-1'
                    style={{
                      fontSize: '20px',
                      color: '#71c6dd',
                      cursor: 'pointer',
                    }}
                  >
                    {user.name}
                  </div>
                </div>
                </a>
              </div>
              <div>{room.description}</div>
              <div className='mb-3 room-topic'>{topic}</div>
            </Container>

            <Container
              style={{ backgroundColor: '#2d2d39', borderRadius: '10px' }}
            
            >
              <Card style={{ backgroundColor: '#2d2d39' }}>
                <Card.Body>
                  <div
                    style={{
                      maxHeight: '280px',
                      height: '280px',
                      overflowY: 'scroll',
                    }}
                  >
                    {messagegroup}
                  </div>

                  {localuser ? (
                    room.participants &&
                    room.participants.includes(localuser._id) ? (
                      <Form onSubmit={handlemessage}>
                        <Form.Group id='name' className='d-flex'>
                          <Form.Control
                            type='text'
                            placeholder='Enter message'
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            className='input-bar'
                          />
                        </Form.Group>
                      </Form>
                    ) : (
                      <Button className='login-btn w-100' onClick={handleJoin}>
                        Join
                      </Button>
                    )
                  ) : (
                    ''
                  )}
                </Card.Body>
              </Card>
            </Container>
          </Card.Body>
        </Card>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          style={{ backgroundColor: '#696d97', border: 'none' }}
          closeButton
        >
          <Modal.Title>Delete Room</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#51546e' }}>
          Are you sure you want to delete the room ?{' '}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#51546e', border: 'none' }}>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='danger' onClick={handleDelete}>
            Delete room
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
