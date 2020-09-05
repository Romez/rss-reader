import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMachine, useService } from '@xstate/react';
import {
  Jumbotron,
  Form,
  Button,
  InputGroup,
  Spinner,
  Row,
  Col,
  ListGroup,
  Modal,
} from 'react-bootstrap';

import Feed from './Feed';
import Post from './Post';
import { getRssMachine } from './machines';

const App = () => {
  const { t } = useTranslation();
  const [rssState, sendRss] = useMachine(getRssMachine(t));
  const [infoState, sendInfo] = useService(rssState.context.infoRef);

  const handleOnChange = ({ target }) => {
    sendRss('NEWRSS.CHANGE', { value: target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendRss('NEWRSS.SUBMIT');
  };

  return (
    <>
      <Jumbotron>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group>
            <InputGroup>
              <Form.Control
                autoFocus
                value={rssState.context.form.rss}
                onChange={handleOnChange}
                placeholder={t('form.placeholder')}
                isValid={rssState.matches('valid')}
                isInvalid={rssState.matches('invalid')}
                readOnly={rssState.matches('submiting.loading')}
              />

              <InputGroup.Append>
                <Button type="submit" disabled={!rssState.matches('valid')} variant="outline-secondary">
                  {rssState.matches('submiting.loading') ? (
                    <>
                      <Spinner as="span" animation="grow" size="sm" />
                      {t('form.submit.loading')}
                    </>
                  ) : (
                    t('form.submit.add')
                  )}
                </Button>
              </InputGroup.Append>

              <Form.Control.Feedback type="invalid">{rssState.context.form.error}</Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form>
      </Jumbotron>
      <p>Example: https://www.liga.net/tech/technology/rss.xml https://ru.hexlet.io/blog.rss</p>
      <Row>
        <Col>
          <ListGroup>
            {rssState.context.feeds.allIds.map((feedId) => {
              const feed = rssState.context.feeds.byId[feedId];
              return <Feed key={feedId} feedRef={feed.ref} />;
            })}
          </ListGroup>
        </Col>

        <Col>
          <ListGroup>
            {rssState.context.posts.allIds.map((id) => {
              const post = rssState.context.posts.byId[id];
              return <Post key={id} postRef={post.ref} />;
            })}
          </ListGroup>
        </Col>
      </Row>

      <Modal show={infoState.matches('reading')} onHide={() => sendInfo('HIDE_DESCRIPTION')}>
        <Modal.Header closeButton>
          <Modal.Title>{infoState.context.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{infoState.context.description}</Modal.Body>
      </Modal>
    </>
  );
};

export default App;
