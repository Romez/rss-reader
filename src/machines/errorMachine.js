import { Machine, sendParent } from 'xstate';

export default () => Machine({
  initial: 'visible',
  states: {
    visible: {
      after: {
        3000: {
          actions: [sendParent((ctx) => ({ type: 'ERROR.REMOVE', error: ctx }))],
        },
      },
    },
  },
});
