import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import setupLocalization from './setupLocalization';

export default () => {
  setupLocalization();
  ReactDOM.render(<App />, document.getElementById('app'));
};
