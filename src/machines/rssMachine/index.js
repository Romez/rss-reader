import { Machine } from 'xstate';

import machine from './machine';
import getActions from './actions';
import services from './services';
import guards from './guards';

export default (t) => {
  const actions = getActions(t);

  return new Machine(machine, { actions, services, guards });
};
