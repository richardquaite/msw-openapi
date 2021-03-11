import { setupServer } from 'msw/node';
import { rest } from 'msw';
import OpenAPIBackend from 'openapi-backend';

const apiDefinition = {
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
            200: { description: 'getPets' },
          },
        },
      },
      '/api/pets/{id}': {
        get: {
          operationId: 'getPetById',
          responses: {
            200: { description: 'getPetsById' },
          },
        },
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'integer',
            },
          },
        ],
      },
    },
  },
};

// create our mock backend with openapi-backend
const handlers = Object.keys(apiDefinition.definition.paths).reduce(
  (a, b) => ({
    ...a,
    [apiDefinition.definition.paths[b].get.operationId]: (c, res, ctx) =>
      res(ctx.status(200), ctx.json(c.operation.responses['200'])),
  }),
  {}
);

const api = new OpenAPIBackend(apiDefinition);
api.register(handlers);

export const server = setupServer(
  rest.get('/api/*', (req, res, ctx) =>
    api.handleRequest(
      {
        path: req.url.pathname,
        query: req.url.search,
        method: req.method,
        headers: req.headers.getAllHeaders(),
        body: req.body,
      },
      res,
      ctx
    )
  )
);
