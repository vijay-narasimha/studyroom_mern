import React, { useEffect, useState, useContext } from 'react';
import { Card, Container, Button ,Form} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Room({ topicname }) {
  const [rooms, setRooms] = useState([]);
  const [topic, setTopic] = useState([]);
  const [user, setUser] = useState([]);
  const [search,setSearch]=useState('')

  async function datafetch() {
    try {
      const rooms = await axios.get(`/rooms?topic=${topicname}&search=${search}`);

      setRooms(rooms.data.rooms);
      setTopic(rooms.data.topics);
      setUser(rooms.data.users);
    } catch (err) {
      console.log(err);
    }
  }
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
    const value= room.private?'Private':""

    return (
    
      <Container key={room._id} className='mb-2'>
        <Card className='main-room'>
          <Card.Body>
            <div>Hosted by:</div>
            <a href={`/userprofile/${user[index].name}`}>

          
            <div className='d-flex '>
              
                <img
                  src={`${process.env.REACT_APP_SERVER_URL}/${user[index].photo}`}
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
                  {user[index].name}
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
            <div className='d-flex justify-content-between mx-4 mt-1' >
          <p className='room-topic'>{topic[index]}</p>
         
         {value==='Private'&& <p className='room-topic'>{value}</p>}

          </div>
          </Card.Body>
        </Card>
      </Container>
    );
  });

  useEffect(() => {
    datafetch();
  }, [topicname,search]);

  return (
    <>
    <Container className='w-50 mt-4'>
    <Form>
            <Form.Group className='mb-3'>
              <Form.Control
                type='text'
                className='input-bar mt-2'
                placeholder='Enter Room name,user,topic'
                autoComplete='off'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form.Group>
          </Form>

    </Container>
      <Container>
        <Container className='mt-3'>
          <Card className='room-heading'>
            <Card.Body className='mx-2'>
              <div className='d-flex justify-content-between'>
                <div style={{ color: '#e5e5e5' }}>
                  {rooms.length} Rooms Available
                </div>
                <Button
                  style={{ backgroundColor: ' #71c6dd', color: '#2d2d39' }}
                  href='/create-room'
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    style={{ marginRight: '6px' }}
                  />
                  Create Room
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
        {roomdata}
      </Container>
    </>
  );
}
