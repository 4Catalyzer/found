import createRender from 'found/lib/createRender';
import React from 'react';

export default createRender({
  renderError: (
    { error }, // eslint-disable-line react/prop-types
  ) => <div>{error.status === 404 ? 'Not found' : 'Error'}</div>,
});
