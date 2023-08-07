import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Container,
  Row,
  Col,
  Card,
  Stack,
  Form,
  Modal,
  Button,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function PrivateRoom() {
  const [err, setErr] = useState('Loading..');
  const [room, setRoom] = useState({});
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [ws, setWs] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});

  const [roommessages, setRoommessages] = useState([]);
  const [show, setShow] = useState(false);

  const localuser = JSON.parse(localStorage.getItem('profile')) || '';

  let code = JSON.parse(localStorage.getItem('private')) || '';

  async function datafetch() {
    if (!code) {
      navigate('/');
    } else {
      try {
        const res = await axios.get(`/privateroom/${code}`);
        setRoom(res.data.room);
        setUsers(res.data.users);
        setUser(res.data.user);
        setRoommessages(res.data.messages);

        setErr('');
      } catch (err) {
        setErr('error ');
      }
    }
  }

  useEffect(() => {
    datafetch();
    connecttows();
  }, []); //eslint-disable-line

  const handleJoin = async () => {
    await axios.get(`/participants/${room.slug}`);
    window.location.reload();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await axios.delete(`/room/${room._id}`);
    window.location.reload(navigate('/'));
  };

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
  function connecttows() {
    const ws = new WebSocket(`wss://${process.env.REACT_APP_WS}`);
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

  const result = users.map((user, index) => {
    return (
      <a href={`/userprofile/${user.name}`} key={index}>
        <div className='w-100 d-flex  my-3' style={{ marginLeft: '8em' }}>
          <img
            src={`${process.env.REACT_APP_SERVER_URL}/${user.photo}`}
            alt='user'
            style={{
              width: '10%',
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
        </div>{' '}
      </a>
    );
  });

  return (
    <>
      <Navbar />

      {err && err.length > 0 ? (
        <Container
          style={{ minHeight: '70vh' }}
          className=' h1 d-flex justify-content-center align-items-center'
        >
          {err}
        </Container>
      ) : (
        <Container>
          <Row className='mt-4' style={{ height: '90vh' }}>
            <Col md={8}>
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
                    <h5 style={{ color: '#e5e5e5', padding: '9px 0' }}>
                      Study Room
                    </h5>
                    {localuser._id === user._id && (
                      <>
                        <a className='ms-auto' href={`/edit-room/${room.slug}`}>
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </a>
                        <p
                          onClick={handleShow}
                          style={{ cursor: 'pointer', color: ' #71c6dd' }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </p>
                      </>
                    )}
                  </Stack>
                  <Card.Body>
                    <Container>
                      <div className='d-flex justify-content-between'>
                        <h2>{room.name}</h2>
                        <p>{timeSince(room.createdAt)}</p>
                      </div>
                      <div className='d-flex w-100'>
                        <div>
                          <p>Hosted by:</p>
                          <a href={`/userprofile/${user.name}`}>
                            <div className='d-flex'>
                              {' '}
                              <img
                                src={`${process.env.REACT_APP_SERVER_URL}/${user.photo}`}
                                alt='user'
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
                        <div style={{ fontSize: '20px' }} className='ms-auto'>
                          Code:
                          <span className='ms-2 text-white'>{room.code}</span>
                        </div>
                      </div>
                      <div>{room.description}</div>
                      <div className='mb-3 room-topic'>{room.topicname}</div>
                    </Container>

                    <Container
                      style={{
                        backgroundColor: '#2d2d39',
                        borderRadius: '10px',
                      }}
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
                              <Button
                                className='login-btn w-100'
                                onClick={handleJoin}
                              >
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
                <Modal.Footer
                  style={{ backgroundColor: '#51546e', border: 'none' }}
                >
                  <Button variant='secondary' onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant='danger' onClick={handleDelete}>
                    Delete room
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
            <Col className='d-none d-md-block'>
              <Container>
                <Card style={{ backgroundColor: '#51546e' }}>
                  <h5
                    style={{
                      textAlign: 'center',
                      padding: '5px 2px',
                      backgroundColor: '#696d97',
                      color: '#e5e5e5',
                      borderTopLeftRadius: '10px',
                      borderTopRightRadius: '10px',
                      height: '45px',
                      paddingTop: '10px',
                    }}
                  >
                    Participants
                  </h5>
                  <div style={{ height: '80vh' }}>{result}</div>
                </Card>
              </Container>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}
