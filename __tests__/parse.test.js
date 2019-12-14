import { promises as fs } from 'fs';
import path from 'path';

import { parseRss } from '../src/utils';

test('shoud parse rss', async () => {
  const data = await fs.readFile(path.resolve('./__tests__/__fixtures__/feed.xml'), 'utf8');

  const expected = {
    title: 'Feed title',
    description: 'Feed description',
    posts: [
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
    ],
  };
  expect(parseRss(data)).toEqual(expected);
});
