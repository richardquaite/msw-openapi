import { setupServer } from 'msw/node';
import { rest, RestRequest } from 'msw';
import OpenAPIBackend, { Document } from 'openapi-backend';

const apiDefinition: Document = {
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
          200: {
            description: 'getPets',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        format: 'int64',
                      },
                      name: { type: 'string' },
                    },
                  },
                },
                example: [
                  {
                    id: 1,
                    name: 'Willis',
                  },
                  {
                    id: 2,
                    name: 'Marjorie',
                  },
                ],
              },
            },
          },
          '401': {
            description: 'Unauthorised',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  example:
                    'You do not have permission to view stores for that company',
                },
              },
            },
          },
        },
      },
    },
    '/api/pets/{id}': {
      get: {
        operationId: 'getPetById',
        responses: {
          200: {
            description: 'getPetById',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                    },
                    name: {
                      type: 'string',
                    },
                  },
                },
                example: {
                  id: 1,
                  name: 'Simon',
                },
              },
            },
          },
          404: {
            description: 'notFound',
            content: {
              'application/json': {
                schema: {
                  type: 'string',
                  example: 'pet not found',
                },
              },
            },
          },
        },
      },
      post: {
        operationId: 'postPet',
        responses: {
          200: {
            description: 'postPet',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                    },
                    name: {
                      type: 'string',
                    },
                  },
                },
                example: {
                  id: 1,
                  name: 'Billy',
                },
              },
            },
          },
        },
      },
      patch: {
        operationId: 'patchPet',
        responses: {
          200: {
            description: 'patchPet',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'integer',
                      format: 'int64',
                    },
                    name: {
                      type: 'string',
                    },
                  },
                },
                example: {
                  id: 1,
                  name: 'Gregory',
                },
              },
            },
          },
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
};

// create our mock backend with openapi-backend
export const api = new OpenAPIBackend({ definition: apiDefinition });
// api.register('notFound', (c, res, ctx) =>
//   res(ctx.status(404), ctx.json({ err: 'not found' }))
// );
api.register('notImplemented', async (c, res, ctx) => {
  if (c.operation.operationId) {
    const { status, mock } = await api.mockResponseForOperation(
      c.operation.operationId
    );
    return res(ctx.status(status), ctx.json(mock));
  }
});

const convertRequest = (req: RestRequest) => ({
  path: req.url.pathname,
  query: req.url.search,
  method: req.method,
  headers: req.headers.getAllHeaders(),
  body: req.body,
});

export const server = setupServer(
  rest.get('/api/*', (req, res, ctx) =>
    api.handleRequest(convertRequest(req), res, ctx)
  ),
  rest.post('/api/*', (req, res, ctx) =>
    api.handleRequest(convertRequest(req), res, ctx)
  ),
  rest.patch('/api/*', (req, res, ctx) =>
    api.handleRequest(convertRequest(req), res, ctx)
  ),
  rest.delete('/api/*', (req, res, ctx) =>
    api.handleRequest(convertRequest(req), res, ctx)
  )
);
