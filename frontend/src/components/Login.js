import React, { useRef, useState } from 'react';
import { Card, Form, Alert, Container, Button, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';


export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
    
      const res = await axios.post('/login', {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
         
      if (res.data.status === 'success') {
        localStorage.setItem('profile', JSON.stringify(res.data.user));
        localStorage.setItem('token',JSON.stringify(res.data.token))
        window.location.reload(navigate('/'));
      }
    } catch (err) {
      setErr(err.response.data.message);
    }
  };

  return (
    <>
      <Navbar />
      <Container
        style={{ minHeight: '100vh' }}
        className='d-flex justify-content-center align-items-center translate-box'

      >
        <div className='w-100' style={{ maxWidth: '350px' }}>
          <Card style={{ backgroundColor: '#51546e', borderRadius: '10px' }}>
            <h2
              className='text-center mb-4 '
              style={{
                background: ' #696d97',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                height: '3.3rem',
                color: '#e5e5e5',
                paddingTop: '4px',
              }}
            >
              Login{' '}
            </h2>
            <Card.Body>
              {err && <Alert variant='danger'>{err}</Alert>}
              <Form onSubmit={handlesubmit}>
                <Form.Group id='email'>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type='email'
                    className='input-bar'
                    ref={emailRef}
                    placeholder='Enter Email'
                  />
                </Form.Group>
                <Form.Group id='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className='input-bar'
                    type='password'
                    ref={passwordRef}
                    placeholder='Enter Password'
                  />
                </Form.Group>

                <Button type='submit' className='mt-4 login-btn'>
                  <FontAwesomeIcon icon={faLock} className='me-2'/>
                  Login
                </Button>
              </Form>
              <div className='w-100 text-center mt-2'>
                Haven't signed up yet ? <Link to='/signup' className='linkbtn'>signup</Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
