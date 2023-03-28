import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Container, Card,Button } from 'react-bootstrap';
import Navbar from './Navbar';
export default function UserProfile() {
  const localuser=JSON.parse(localStorage.getItem('profile'))
  const [user, setUser] = useState({});
  const [rooms, setRooms] = useState([]);
  const [topic,setTopic]=useState([])

  async function datafetch() {
    const res = await axios.get(`/user/${localuser.name}`);
    
    setRooms(res.data.rooms);
    setUser(res.data.user);
    setTopic(res.data.topics)
  }
  useEffect(() => {
    datafetch();
   
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

  

  const roomdata = rooms.map((room, index) => {
    return (
      <Container key={index} className='mb-2'>
        <Card className='main-room'>
          <Card.Body>
           
            <a href={`/userprofile/${user.name}`}>


          
            <div className='d-flex '>
              
                <img
                  src={`${process.env.REACT_APP_SERVER_URL}/${user.photo}`}
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
              

              <div>{timeSince(room.createdAt)}</div>
            </div>
            </a>
            <a className='room-title' href={`/room/${room.slug}`}>
              {room.name}
            </a>

            <div
              style={{ borderBottom: '1px solid black', height: '50px' }}
              className='pb-2'
            >
              {room.description}
            </div>
            <p className='room-topic'>{topic[index]}</p>
          </Card.Body>
        </Card>
      </Container>
    );
  });




  return (
    <>
      <Navbar />
      <Container
        style={{
          minHeight: '80vh',
          maxWidth: '60rem',
          backgroundColor: '#2d2d39',
        }}
        className='d-flex justify-content-center mt-5'
      >
        <Card style={{ width: '100%', backgroundColor: '#2d2d39' }}>
          <div className='d-flex flex-column align-items-center'>
            <div className='text-center'>
              <img
                src={`${process.env.REACT_APP_SERVER_URL}/${user.photo}`}
                style={{
                  width: '18%',

                  borderRadius: '50%',
                  border: '2px solid #71c6dd',
                }}
              />
            </div>
            <div
              style={{ color: '#e5e5e5', fontSize: '23px' }}
              className='mt-2'
            >
              {user.name}
            </div>
            <Button href='/edit-profile' variant="outline-info" className='mt-2'>Edit Profile</Button>
          </div>
          <div className='mt-2'>
            <p style={{ color: ' #696d97', fontSize: '18px' }}>ABOUT</p>
            <p>{user.bio}</p>
          </div>

          <div>
            <p
              style={{
                color: ' #696d97',
                fontSize: '18px',
                letterSpacing: '2px',
              }}
            >
              Rooms Hosted By{' '}
              <span style={{ letterSpacing: '3px' }}>{user.name}</span>
            </p>
            {roomdata.length>0 ? roomdata:'No rooms are hosted..'}
          </div>
        </Card>
      </Container>
    </>
  );
}
