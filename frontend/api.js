/* eslint-disable import/first, import/newline-after-import, quote-props */
/* global window */
import es6promise from 'es6-promise';
es6promise.polyfill();

import Frisbee from 'frisbee';

const api = new Frisbee({
  baseURI: `${window.location.origin}/`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;
