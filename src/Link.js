import BaseLink from './BaseLink';
import withRouter from './withRouter';

const Link = withRouter(BaseLink);
Link.displayName = 'Link';

export default Link;
