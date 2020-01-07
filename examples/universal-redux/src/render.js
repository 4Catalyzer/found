import React from 'react';
import createRender from 'found/lib/createRender';

export default createRender({
  /* eslint-disable react/prop-types */
  renderError: ({ error }) => (
    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
  ),
  /* eslint-enable react/prop-types */
});
