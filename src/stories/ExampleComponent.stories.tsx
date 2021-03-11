import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { api, handlers } from '../apiServer';

import { ExampleComponent } from '../ExampleComponent';

export default {
  title: 'Example/ExampleComponent',
  component: ExampleComponent,
} as Meta;

export const Primary = () => {
  /**
   * this is a bit of a ballache
   */
  api.register('getPets', handlers.notImplemented);
  return <ExampleComponent />;
};
export const NoPets = () => {
  const mockHandler = (c, res, ctx) => res(ctx.json([]));
  api.register('getPets', mockHandler);
  return <ExampleComponent />;
};
