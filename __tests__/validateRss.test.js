import { getInitialState } from '../src/app';
import { validateRss } from '../src/utils';

let state;

beforeEach(() => {
  state = getInitialState();
});

test('should return empty status', () => {
  const status = validateRss('', state);
  expect(status).toBe('empty');
});

test('should return invalid, wrong url', () => {
  const status = validateRss('http://example', state);
  expect(status).toBe('invalid');
});

test('should return valid status', () => {
  const status = validateRss('http://rss.com/feed', state);
  expect(status).toBe('valid');
});

test('should return invalid, already has url', () => {
  state.feeds = { 'http://rss.com': { title: 'title', description: 'description' } };
  const status = validateRss('http://rss.com', state);
  expect(status).toBe('exists');
});
