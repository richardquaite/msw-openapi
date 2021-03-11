import axios from 'axios';

describe('msw and openapi-backend', () => {
  it('should work', async () => {
    const res = await axios.get('/api/pets');
    expect(res.status).toBe(200);
  });

  it('should handle get requests', async () => {
    const res = await axios.get('/api/pets');
    expect(res.data).toEqual([{ id: 1 }]);
  });

  it('should handle post requests', async () => {
    const res = await axios.post('/api/pets');
    expect(res.data).toEqual({ id: 1 });
  });

  it('should handle patch requests', async () => {
    const res = await axios.patch('/api/pets');
    expect(res.data).toEqual({ id: 1 });
  });

  it('should return allow request params', async () => {
    const res = await axios.get('/api/pets/1');
    expect(res.data).toEqual({ id: 1 });
  });

  it.skip('should handle incorrect api paths allow request params', async () => {
    const res = await axios.get('/api/unknown');
    expect(res.status).toEqual(404);
  });
});
