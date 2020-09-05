import { Machine, sendParent, sendUpdate } from 'xstate';
import { get } from 'axios';

export default () => {
  const actions = {
    removeFeed: sendParent((ctx) => ({ type: 'FEED.REMOVE', feed: ctx })),
    handleFulfilled: sendParent((ctx, { data }) => ({ type: 'FEED.UPDATE', data: data.data, feed: ctx })),
  };

  const services = {
    getFeed: (ctx) => {
      const proxy = 'https://cors-anywhere.herokuapp.com';
      const target = [proxy, ctx.rss].join('/');

      return get(target);
    },
  };

  return Machine(
    {
      type: 'parallel',
      states: {
        edit: {
          on: {
            REMOVE: { actions: ['removeFeed', sendUpdate()] },
          },
        },
        updating: {
          initial: 'manual',
          states: {
            manual: {
              on: {
                UPDATE: { target: 'loading' },
              },
            },
            loading: {
              invoke: {
                src: 'getFeed',
                onDone: {
                  actions: 'handleFulfilled',
                  target: 'manual',
                },
                onFailure: {},
              },
            },
          },
        },
      },
    },
    { actions, services },
  );
};
