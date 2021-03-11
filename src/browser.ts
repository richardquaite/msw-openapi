import { setupWorker } from 'msw';
import { mswHandlers } from './apiServer';

export const worker = setupWorker(...mswHandlers);
