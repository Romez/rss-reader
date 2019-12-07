import { initialState } from '../src/app';
import validateRss from '../src/validateRss';

test('should return empty status', () => {
  expect(validateRss('', initialState)).toEqual({ status: 'empty', message: '' });
});

test('should return invalid, wrong url', () => {
  expect(validateRss('http://example', initialState)).toEqual({ status: 'invalid', message: 'Address is not valid' });
});

test('should return valid status', () => {
  expect(validateRss('http://rss.com/feed', initialState)).toEqual({ status: 'valid', message: '' });
});

test('should return invalid, already has url', () => {
  const state = { ...initialState, feeds: { 'http://rss.com': { title: 'title', description: 'description' } } };
  expect(validateRss('http://rss.com', state)).toEqual({ status: 'invalid', message: 'http://rss.com already exists' });
});
