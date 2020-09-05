const validMachine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        'NEWRSS.SUBMIT': 'loading',
      },
    },
    loading: {
      invoke: {
        src: 'getFeed',
        onDone: {
          actions: ['handleFulfilled', 'skipForm', 'persist'],
          target: '#rss.validating',
        },
        onError: {
          target: 'failure',
        },
      },
    },
    failure: {},
  },
};

export default validMachine;
