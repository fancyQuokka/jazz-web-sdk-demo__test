/* eslint-disable import/order */
import React from 'react';

import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

import { AppContainer } from './AppContainer';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

setTimeout(() => {
  root.render(
    <AppContainer />
  );
}, 100)
