import { Machine, sendParent, assign } from 'xstate';

export default () => {
  const context = {
    title: '',
    description: '',
  };

  const actions = {
    removePost: sendParent((ctx) => ({ type: 'POST.REMOVE', payload: ctx })),
    showDescription: sendParent((ctx) => ({ type: 'POST.SHOW_DESCRIPTION', post: ctx })),
    setAsVisited: assign({ type: 'visited' }),
    setAsVisitedParent: sendParent((ctx) => ({ type: 'POST.SET_AS_VISITED', post: ctx })),
  };

  const guards = {
    isVisited: (ctx) => ctx.isVisited,
  };

  return Machine(
    {
      initial: 'init',
      context,
      on: {
        REMOVE: { actions: 'removePost' },
      },
      states: {
        init: {
          on: {
            '': [
              { target: 'visited', cond: 'isVisited' },
              { target: 'new' },
            ],
          },
        },
        new: {
          on: {
            SHOW_DESCRIPTION: { target: 'visited', actions: ['setAsVisited', 'setAsVisitedParent', 'showDescription'] },
          },
        },
        visited: {
          on: { SHOW_DESCRIPTION: { actions: 'showDescription' } },
        },
      },
    },
    { actions, guards },
  );
};
