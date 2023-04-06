import React, { useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
export default function Participants() {
  const { id } = useParams();

  const [users, setUsers] = useState([]);

  async function datafetch() {
    const res = await axios.get(`/roomparticipants/${id}`);
    setUsers(res.data.users);
  }

  const result = users.map((user, index) => {
    
    return (
    <a href={`/userprofile/${user.name}`} key={index}> 
    <div  className='w-100 d-flex  my-3' style={{marginLeft:'8em'}}>  
    
    <img
    src={`${process.env.REACT_APP_SERVER_URL}/${user.photo}`}
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
  </div></div>  </a>);
  });

  useEffect(() => {
    datafetch();
  }, []);
  return (
    <>
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
    </>
  );
}
