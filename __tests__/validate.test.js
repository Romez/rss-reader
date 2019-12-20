import { getInitialState } from '../src/app';
import { validateRss } from '../src/utils';

let state;

beforeEach(() => {
  state = getInitialState();
});

test('should return empty status', () => {
  expect(validateRss('', state)).toEqual({ status: 'empty', message: '' });
});

test('should return invalid, wrong url', () => {
  expect(validateRss('http://example', state)).toEqual({ status: 'invalid', message: 'Address is not valid' });
});

test('should return valid status', () => {
  expect(validateRss('http://rss.com/feed', state)).toEqual({ status: 'valid', message: '' });
});

test('should return invalid, already has url', () => {
  state.feeds = { 'http://rss.com': { title: 'title', description: 'description' } };
  expect(validateRss('http://rss.com', state)).toEqual({ status: 'invalid', message: 'http://rss.com already exists' });
});
