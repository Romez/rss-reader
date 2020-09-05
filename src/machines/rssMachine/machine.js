import { spawn, assign } from 'xstate';

import valid from './valid';
import getInfoMachine from '../infoMachine';

export default {
  id: 'rss',
  initial: 'init',
  context: {
    posts: { allIds: [], byId: {} },
    feeds: { allIds: [], byId: {} },
    form: { rss: '', error: '' },
    infoRef: undefined,
  },
  on: {
    'NEWRSS.CHANGE': { target: 'validating', actions: 'changeRss' },
    'FEED.REMOVE': { target: 'validating', actions: ['removeFeed', 'persist'] },
    'FEED.UPDATE': { actions: ['updateFeed', 'persist'] },
    'POST.REMOVE': { actions: ['removePost', 'persist'] },
    'POST.SHOW_DESCRIPTION': { actions: 'showDescription' },
    'POST.SET_AS_VISITED': { actions: ['setPostAsVisited', 'persist'] },
  },
  states: {
    init: {
      onEntry: [
        'initContext',
        assign({
          infoRef: () => spawn(getInfoMachine()),
        }),
      ],
      on: { '': 'validating' },
    },
    validating: {
      on: {
        '': [
          { target: 'empty', cond: 'isRssEmpty' },
          { target: 'invalid', cond: 'isExists', actions: 'setExistsUrlError' },
          { target: 'invalid', cond: 'isNotUrl', actions: 'setInvalidUrlError' },
          { target: 'valid' },
        ],
      },
    },
    empty: {},
    valid,
    invalid: {},
  },
};
