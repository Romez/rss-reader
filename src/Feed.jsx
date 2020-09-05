import React from 'react';
import { ListGroupItem, Button } from 'react-bootstrap';
import cn from 'classnames';
import { useService } from '@xstate/react';

const Feed = ({ feedRef }) => {
  const [state, send, service] = useService(feedRef);

  const handleRemove = () => {
    send('REMOVE');
    service.stop();
  };

  const handleUpdate = () => {
    send('UPDATE');
  };

  return (
    <ListGroupItem className="d-flex justify-content-between align-items-center">
      {state.context.title}

      <div className="d-flex">
        <Button variant="outline-dark" onClick={handleUpdate}>
          <i role="button" className={cn('fas', 'fa-sync', { 'fa-spin': state.matches({ updating: 'loading' }) })}></i>
        </Button>

        <Button variant="outline-dark ml-2" onClick={handleRemove}>
          <i role="button" className={cn('fas', 'fa-times')}></i>
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default Feed;
