import React, { useEffect, useState } from 'react';
import { Container, Card } from 'react-bootstrap';
import axios from 'axios';

export default function Topics({ setTopicname, topicname }) {
  const [topic, setTopic] = useState([]);
  const [roomlength, setRoomlength] = useState(0);

  useEffect(() => {
    async function datafetch() {
      const res = await axios.get('/topics');
      const rooms = await axios.get(`/rooms`);
      setRoomlength(rooms.data.rooms.length);
      setTopic(res.data.items);
    }
    datafetch();
  }, []);

  const topics = topic.map((item) => {
    return (
      <div
        className='w-100 my-3  topic-box'
        key={item[0]}
        style={{ cursor: 'pointer' }}
        onClick={(e) => setTopicname(item[0])}
      >
        {item[0] === topicname ? (
          <>
            <span className='active-topic'>{item[0]} </span>
            <span
              style={{ position: 'absolute', right: '0' }}
              className='active-topic'
            >
              {item[1]}
            </span>
          </>
        ) : (
          <>
            {item[0]}
            <span style={{ position: 'absolute', right: '0' }}>{item[1]}</span>
          </>
        )}
      </div>
    );
  });

  return (
    <>
      <Container className='mt-5'>
        <Card className='custom-topics'>
          <Card.Body>
            <p className='h6 topic-title text-center me-4'>Browse Topics</p>
            <Container style={{ maxWidth: '150px', position: 'relative' }}>
              <div
                className='mt-3 topic-box'
                style={{ cursor: 'pointer' }}
                onClick={(e) => setTopicname(' ')}
              >
                {'' === topicname ? (
                  <>
                    <span className='active-topic'>All </span>
                    <span
                      style={{ position: 'absolute', right: '0' }}
                      className='active-topic'
                    >
                      {roomlength}
                    </span>
                  </>
                ) : (
                  <>
                    All{' '}
                    <span style={{ position: 'absolute', right: '0' }}>
                      {roomlength}
                    </span>
                  </>
                )}
              </div>
              {topics}
            </Container>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
