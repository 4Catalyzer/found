import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';
import '@testing-library/jest-dom';

Enzyme.configure({ adapter: new Adapter() });

(global as any).__DEV__ = true; // eslint-disable-line no-underscore-dangle
