import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Container, Row, Col } from 'react-bootstrap';
import Chat from '../components/Chat';
import Participants from '../components/Participants';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function RoomPage() {
  const { id } = useParams();
  const [err, setErr] = useState('err');
  async function datafetch() {
    try {
      const res = await axios.get(`/room/${id}`);

      if (res.data.status === 'error') {
        setErr(res.data.message);
      } else {
        setErr('');
      }
    } catch (err) {
      setErr(err.response.data.message);
    }
  }

  useEffect(() => {
    datafetch();
  }, []);

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
              <Chat />
            </Col>
            <Col className='d-none d-md-block'>
              <Participants />
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}
