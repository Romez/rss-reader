import { promises as fs } from 'fs';
import path from 'path';

import parseRss from '../src/parseRss';

test('shoud parse rss', async () => {
  const data = await fs.readFile(path.resolve('./__tests__/__fixtures__/feed.xml'), 'utf8');

  const expected = {
    title: 'Feed title',
    description: 'Feed description',
    posts: [
      {
        title: 'Title 1',
        link: 'http://example.com/1',
        description: 'Description 1',
      },
      {
        title: 'Title 2',
        link: 'http://example.com/2',
        description: 'Description 2',
      },
    ],
  };
  expect(parseRss(data)).toEqual(expected);
});
