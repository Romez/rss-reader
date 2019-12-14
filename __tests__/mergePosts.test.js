import { mergePosts } from '../src/utils';

test('should merge posts by max date', () => {
  const oldPosts = [
    {
      id: 1,
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  ];

  const newPosts = [
    {
      id: 2,
      title: 'Title 2',
      link: 'http://example.com/2',
      description: 'Description 2',
      date: new Date('Sat, 30 Nov 2019 12:48:00 GMT'),
    },
    {
      id: 3,
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  ];

  const expected = [
    {
      id: 2,
      title: 'Title 2',
      link: 'http://example.com/2',
      description: 'Description 2',
      date: new Date('Sat, 30 Nov 2019 12:48:00 GMT'),
    },
    {
      id: 1,
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  ];

  expect(mergePosts(oldPosts, newPosts)).toEqual(expected);
});

test('should not merge same posts', () => {
  const oldPosts = [
    {
      id: 1,
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  ];

  const newPosts = [
    {
      id: 2,
      title: 'Title 1',
      link: 'http://example.com/1',
      description: 'Description 1',
      date: new Date('Sat, 30 Nov 2019 12:47:00 GMT'),
    },
  ];

  expect(mergePosts(oldPosts, newPosts)).toEqual(oldPosts);
});
