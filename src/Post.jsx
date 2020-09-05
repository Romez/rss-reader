import React from 'react';
import { ListGroupItem, Button } from 'react-bootstrap';
import cn from 'classnames';
import { useService } from '@xstate/react';

const Post = ({ postRef }) => {
  const [post, sendPost, service] = useService(postRef);

  const { title, link } = post.context;

  const handleShowInfo = () => {
    sendPost('SHOW_DESCRIPTION');
  };

  const handleRemove = () => {
    sendPost('REMOVE');
    service.stop();
  };

  return (
    <ListGroupItem
      className={cn('d-flex align-items-center', 'justify-content-between', {
        'bg-info': post.matches('new'),
      })}
    >
      <a className={cn({ 'text-white': post.matches('new') })} href={link}>
        {title}
      </a>

      <div className="d-flex justify-content-between align-items-center">
        <Button variant="outline-dark" onClick={handleShowInfo}>
          <i role="button" className="fas fa-info"></i>
        </Button>

        <Button className="ml-2" variant="outline-dark" onClick={handleRemove}>
          <i role="button" className="fas fa-times"></i>
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default Post;
