import RedirectException from './RedirectException';
import { RouteObject, type Match, type RedirectOptions } from './typeUtils';

export type RedirectRoute = RedirectOptions & RouteObject;

export default function createRedirect({
  to,
  from,
  status,
}: RedirectOptions): RedirectRoute {
  return {
    path: from,
    to,
    status,
    render({ match }: { match: Match }): JSX.Element {
      const { to, status } = this as any;
      let toLocation;

      if (typeof to === 'function') {
        toLocation = to(match);
      } else {
        const { router, params } = match;
        toLocation = router.matcher.format(to, params);
      }

      throw new RedirectException(toLocation, status);
    },
  };
}
