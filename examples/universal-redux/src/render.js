import createRender from 'found/createRender';
import React from 'react';

export default createRender({
  renderError: ({ error }) => (
    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
  ),
});
