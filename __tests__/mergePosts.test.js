import { mergePosts } from '../src/utils';

test('should merge posts by max date', () => {
  const oldPosts = [
    {
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  ];

  const newPosts = [
    {
      title: 'Title 2',
      link: 'http://example.com/2',
      description: 'Description 2',
      date: new Date('Sat, 30 Nov 2019 12:48:00 GMT'),
    },
    {
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  ];

  const expected = {
    0: {
      title: 'Title 2',
      link: 'http://example.com/2',
      description: 'Description 2',
      date: new Date('Sat, 30 Nov 2019 12:48:00 GMT'),
    },
    1: {
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  };

  expect(mergePosts(oldPosts, newPosts)).toEqual(expected);
});
