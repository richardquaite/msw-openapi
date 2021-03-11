import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { api } from './apiServer';
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
      axios.get('/api/unkown').catch((err) => err)
    );
    expect(err.response.status).toBe(404);
  });

  /**
   * Once a new handler is registered for an operation, every request to that
   * path hits this handler instead of the `notImplemented` one which returns
   * the api definition example data :-(
   */
  it('can override example responses', async () => {
    const mockResponse = [{ id: 2, name: 'Odie' }];
    const mockHandler = jest.fn((c, res, ctx) => res(ctx.json(mockResponse)));
    api.register('getPetById', mockHandler);

    const res = await axios.get('/api/pets/2');
    expect(res.data).toEqual(mockResponse);
  });

  it('should work with react components', async () => {
    render(<ExampleComponent />);
    expect(screen.getByText('No pets')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('No pets')).not.toBeInTheDocument()
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Willis')).toBeInTheDocument();
    expect(screen.getByText('Marjorie')).toBeInTheDocument();
  });

  it('can assert based on the standard mocked response', async () => {
    const mockResponse = await axios.get('/api/pets').then((res) => res.data);

    render(<ExampleComponent />);
    expect(screen.getByText('No pets')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('No pets')).not.toBeInTheDocument()
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(mockResponse.length);
    mockResponse.forEach((pet) =>
      expect(screen.getByText(pet.name)).toBeInTheDocument()
    );
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
    expect(screen.getByText('No pets')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('No pets')).not.toBeInTheDocument()
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(mockResponse.length);
    mockResponse.forEach((pet) =>
      expect(screen.getByText(pet.name)).toBeInTheDocument()
    );
  });
});
