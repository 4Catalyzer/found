import React, { useRef } from 'react';

function useLastProps(props, match, shouldInvalidate) {
  const lastPropsRef = useRef(null);

  // Reset back to `null` if the route changes, this  guards
  // against the case where two Routes render StaleWhileFetching
  // and accidently pass data from one route to another
  if (lastPropsRef.current?.match.route !== match.route) {
    lastPropsRef.current = null;
  }

  // Take the newest props, or else the old props with the new match.
  lastPropsRef.current = props || lastPropsRef.current;

  const lastProps = lastPropsRef.current;

  if (!lastProps || shouldInvalidate?.(lastProps, match)) {
    return null;
  }

  return lastProps;
}

function StaleWhileFetching({
  Component,
  props,
  match,
  shouldInvalidate,
  fallback,
  ...ownProps
}) {
  const lastProps = useLastProps(props, match, shouldInvalidate);

  if (!lastProps) {
    return fallback;
  }

  return (
    <Component {...lastProps} match={match} loading={!props} {...ownProps} />
  );
}

export default StaleWhileFetching;
