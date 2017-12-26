import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.__DEV__ = true; // eslint-disable-line no-underscore-dangle
