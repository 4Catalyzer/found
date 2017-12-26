import React from 'react';
import createRender from 'found/lib/createRender';

export default createRender({
  renderError: (
    { error }, // eslint-disable-line react/prop-types
  ) => <div>{error.status === 404 ? 'Not found' : 'Error'}</div>,
});
