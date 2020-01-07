import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  data: PropTypes.string,
};

function Bar({ data }) {
  return <div>{data}</div>;
}

Bar.propTypes = propTypes;

export default Bar;
