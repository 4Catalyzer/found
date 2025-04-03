import { type ComponentPropsWithRef, forwardRef, useContext } from 'react';

import RouterContext, { type RouterContextValue } from './RouterContext';

export default function withRouter<
  TComponent extends React.ComponentType<any>,
>(Component: TComponent) {
  const WithRouter = forwardRef((props: any, ref) => {
    const context = useContext(RouterContext);

    return <Component {...context} {...props} ref={ref} />;
  });

  WithRouter.displayName = `withRouter(${
    Component.displayName || Component.name
  })`;

  return WithRouter as React.ForwardRefExoticComponent<
    Omit<ComponentPropsWithRef<TComponent>, keyof RouterContextValue>
  >;
}
