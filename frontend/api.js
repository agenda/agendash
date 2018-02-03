import es6promise from 'es6-promise';
es6promise.polyfill();

import Frisbee from 'frisbee';

const api = new Frisbee({
  baseURI: `${window.location.origin}/api/`,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;
