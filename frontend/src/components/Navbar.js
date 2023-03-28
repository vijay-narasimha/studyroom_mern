import React, { useContext } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { UserContext } from '../App';
import {Link} from 'react-router-dom'
import Fav from '../assets/favicon.ico';
export default function Navbarcomponet() {
  const { user } = useContext(UserContext);

  const handlelogout = () => {
    localStorage.clear();
    window.location.reload();
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
    </>
  );
}
