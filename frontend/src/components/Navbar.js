import React, { useContext, useState } from 'react';
import { Container, Nav, Navbar, Modal, Button, Form } from 'react-bootstrap';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import Fav from '../assets/favicon.ico';
export default function Navbarcomponet() {
  const { user } = useContext(UserContext);

  const handlelogout = () => {
    localStorage.clear();
    window.location.reload();
  };
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleModal = () => {
    localStorage.setItem('private', JSON.stringify(code));
    navigate('privateroom');
  };
  return (
    <>
      <Navbar className='custom-navbar' sticky='top'>
        <Container>
          <Navbar.Brand
            href='/'
            style={{ color: '#e5e5e5', fontWeight: '600' }}
          >
            <img src={Fav} width='20%' />
            <span className='ms-3 ' style={{ fontSize: '24px' }}>
              Study Room
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            {user ? (
              <Nav className='ms-auto text-center'>
                <a href={`/userprofile/${user.name}`}>
                  <div className='d-flex'>
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}/${user.photo}`}
                      style={{
                        width: '10%',
                        marginLeft: 'auto',
                        borderRadius: '50%',
                        border: '2px solid #71c6dd',
                      }}
                    />

                    <div
                      style={{
                        color: '#71c6dd',
                        padding: '10px',
                        fontSize: '20px',
                      }}
                    >
                      {user.name}
                    </div>
                  </div>
                </a>
                <Nav.Link
                  onClick={handleShow}
                  style={{
                    color: '#e5e5e5',
                    fontWeight: '500',
                    fontSize: '20px',
                  }}
                >
                  Enter Room
                </Nav.Link>
                <Nav.Link
                  onClick={handlelogout}
                  style={{
                    color: '#e5e5e5',
                    fontWeight: '500',
                    fontSize: '20px',
                  }}
                  href='/'
                >
                  Logout
                </Nav.Link>
              </Nav>
            ) : (
              <Nav className='ms-auto text-center'>
                <Nav.Link
                  href='/login'
                  style={{
                    color: '#e5e5e5',
                    fontWeight: '500',
                    fontSize: '20px',
                  }}
                >
                  Login
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          style={{ backgroundColor: '#696d97', border: 'none' }}
          closeButton
        >
          <Modal.Title>Enter Room</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#51546e' }}>
          Enter the code to enter the private room
          <Form>
            <Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
              <Form.Control
                type='text'
                className='input-bar mt-2'
                placeholder='Enter code here'
                autoComplete='off'
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#51546e', border: 'none' }}>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='info' onClick={handleModal}>
            Enter room
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
