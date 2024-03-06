import { createElement } from 'react';

function Bar({ data }: { data: string }) {
  return createElement('div', null, data);
}

export default Bar;
