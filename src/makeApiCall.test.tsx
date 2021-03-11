import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { api, handlers } from './apiServer';
import { ExampleComponent } from './ExampleComponent';

describe('msw and openapi-backend', () => {
  it('should work with axios', async () => {
    const res = await axios.get('/api/pets');
    expect(res.status).toBe(200);
  });

  it('should work with fetch', async () => {
    const res = await fetch('/api/pets', { method: 'get' });
    expect(res.status).toBe(200);
  });

  it('should handle get requests', async () => {
    const res = await axios.get('/api/pets');
    expect(res.data).toEqual([
      {
        id: 1,
        name: 'Willis',
      },
      {
        id: 2,
        name: 'Marjorie',
      },
    ]);
  });

  it('should handle post requests', async () => {
    const res = await axios.post('/api/pets', { name: 'Billy' });
    expect(res.data).toEqual({ id: 1, name: 'Billy' });
  });

  it('should handle post validation errors', async () => {
    const err = await waitFor(() =>
      axios.post('/api/pets', {}).catch((err) => err)
    );
    expect(err.response.status).toBe(400);
  });

  it('should allow request params', async () => {
    const res = await axios.get('/api/pets/1');
    expect(res.data).toEqual({ id: 1, name: 'Simon' });
  });

  it('should handle patch requests', async () => {
    const res = await axios.patch('/api/pets/1');
    expect(res.data).toEqual({ id: 1, name: 'Gregory' });
  });

  it('should handle method not allowed', async () => {
    const err = await waitFor(() =>
      axios.delete('/api/pets').catch((err) => err)
    );
    expect(err.response.status).toBe(405);
  });

  it('should handle path not found', async () => {
    const err = await waitFor(() =>
      axios.get('/api/unknown').catch((err) => err)
    );
    expect(err.response.status).toBe(404);
  });

  /**
   * Once a new handler is registered for an operation, every request to that
   * path hits this handler instead of the `notImplemented` one which returns
   * the api definition example data. So it needs to be re-registered to use
   * the notImplemented implmentation. Ideally we could move this to `afterEach`
   * in setupTests.ts
   */
  it('can override example responses', async () => {
    const mockResponse = [{ id: 2, name: 'Odie' }];
    const mockHandler = jest.fn((c, res, ctx) => res(ctx.json(mockResponse)));
    api.register('getPetById', mockHandler);

    const res = await axios.get('/api/pets/2');
    expect(res.data).toEqual(mockResponse);
    api.register('getPetById', handlers.notImplemented);
  });

  it('should work with react components', async () => {
    render(<ExampleComponent />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
    );
    expect(typeof screen.getAllByRole('listitem')).toEqual('object');
  });

  it('should work with react components and mocked responses', async () => {
    const mockResponse = [
      { id: 1, name: 'Pet A' },
      { id: 2, name: 'Pet B' },
      { id: 3, name: 'Pet C' },
    ];
    const mockHandler = jest.fn((c, res, ctx) => res(ctx.json(mockResponse)));
    api.register('getPets', mockHandler);

    render(<ExampleComponent />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Pet A')).toBeInTheDocument();
    expect(screen.getByText('Pet B')).toBeInTheDocument();
    expect(screen.getByText('Pet C')).toBeInTheDocument();
    api.register('getPets', handlers.notImplemented);
  });

  it('can assert based on the standard mocked response', async () => {
    // this is the equivalent of importing from the generated api response mocks
    const mockResponse = await axios.get('/api/pets').then((res) => res.data);

    render(<ExampleComponent />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Loading')).not.toBeInTheDocument()
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(mockResponse.length);
    mockResponse.forEach((pet) =>
      expect(screen.getByText(pet.name)).toBeInTheDocument()
    );
  });

  it('can override responses to simulate functionality', async () => {
    const mockResponse = await axios.get('/api/pets/1').then((res) => res.data);

    const res1 = await axios.get('/api/pets/1');
    expect(res1.data).toEqual({ id: 1, name: 'Simon' });

    const mockResponseWithMore = { ...mockResponse, name: 'Gordon' };
    const mockHandler = jest.fn((c, res, ctx) =>
      res(ctx.json(mockResponseWithMore))
    );
    api.register('getPetById', mockHandler);

    const res2 = await axios.get('/api/pets/1');
    expect(res2.data).toEqual({ id: 1, name: 'Gordon' });

    api.register('getPetById', handlers.notImplemented);
  });
});
