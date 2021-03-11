import { setupServer } from 'msw/node';
import { mswHandlers } from './apiServer';

// @ts-ignore because who cares
export const server = setupServer(...mswHandlers);
