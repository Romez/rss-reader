import { Machine, assign } from 'xstate';

export default () => {
  const actions = {
    setPost: assign((_ctx, { post }) => {
      const { title, description } = post;
      return { title, description };
    }),
  };

  return Machine(
    {
      id: 'info',
      initial: 'idle',
      context: {
        title: '',
        description: '',
      },
      states: {
        idle: {
          on: {
            SHOW_DESCRIPTION: { target: 'reading', actions: 'setPost' },
          },
        },
        reading: {
          on: {
            SHOW_DESCRIPTION: { actions: 'setPost' },
            HIDE_DESCRIPTION: 'idle',
          },
        },
      },
    },
    { actions },
  );
};
