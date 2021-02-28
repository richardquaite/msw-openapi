import { setupServer } from 'msw/node';
import { rest } from 'msw';
import OpenAPIBackend from 'openapi-backend';

// create our mock backend with openapi-backend
const api = new OpenAPIBackend({
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    paths: {
      '/api/pets': {
        get: {
          operationId: 'getPets',
          responses: {
            200: { description: 'ok' },
          },
        },
      },
    },
  },
});

api.register('notFound', (c, res, ctx) => res(ctx.status(404)));

export const server = setupServer(
  rest.get('/api/*', (req, res, ctx) => {
    console.log(req.url.pathname);
    return api.handleRequest(
      // req, // <- this was in the example, but is the wrong format
      {
        path: req.url.pathname,
        query: req.url.search,
        method: req.method,
        headers: {},
      },
      res,
      ctx
    );
  })
);
