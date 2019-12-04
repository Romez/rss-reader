import { validateRss, initialState } from '../src/app';

test('should return empty status', () => {
  expect(validateRss('')).toEqual({ status: 'empty', message: '' });
});

test('should return invalid, wrong url', () => {
  expect(validateRss('http://example')).toEqual({ status: 'invalid', message: 'Wrong url' });
});

test('should return valid status', () => {
  expect(validateRss('http://rss.com/feed')).toEqual({ status: 'valid', message: '' });
});

test('should return invalid, already has url', () => {
  const state = { ...initialState, feeds: { 'http://rss.com': { title: 'title', description: 'description' } } };
  expect(validateRss('http://rss.com', state)).toEqual({ status: 'invalid', message: 'http://rss.com already exists' });
});
