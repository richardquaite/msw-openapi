import { waitFor } from '@testing-library/dom';
import axios from 'axios';
import { api } from './apiServer';

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

  it('should allow request params', async () => {
    const res = await axios.get('/api/pets/1');
    expect(res.data).toEqual({ id: 1, name: 'Simon' });
  });

  it('should handle post requests', async () => {
    const res = await axios.post('/api/pets/1');
    expect(res.data).toEqual({ id: 1, name: 'Billy' });
  });

  it('should handle patch requests', async () => {
    const res = await axios.patch('/api/pets/1');
    expect(res.data).toEqual({ id: 1, name: 'Gregory' });
  });

  it('can override example responses', async () => {
    const mockResponse = [{ id: 2, name: 'Odie' }];
    const mockHandler = jest.fn((c, res, ctx) => res(ctx.json(mockResponse)));
    api.register('getPetById', mockHandler);

    const res = await axios.get('/api/pets/2');
    expect(res.data).toEqual(mockResponse);
  });

  it('should handle method not allowed', async () => {
    const err = await waitFor(() =>
      axios
        .post('/api/pets')
        .then((res) => res)
        .catch((err) => err)
    );
    expect(err.response.status).toBe(405);
  });

  it('should handle path not found', async () => {
    const err = await waitFor(() =>
      axios
        .get('/api/unkown')
        .then((res) => res)
        .catch((err) => err)
    );
    expect(err.response.status).toBe(404);
  });
});
