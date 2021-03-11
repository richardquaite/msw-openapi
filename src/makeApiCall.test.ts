import axios from 'axios';

describe('msw and openapi-backend', () => {
  it('should work', async () => {
    const res = await axios.get('/api/pets');
    expect(res.status).toBe(200);
  });

  it('should return json', async () => {
    const res = await axios.get('/api/pets');
    expect(res.data.description).toEqual('getPets');
  });

  it('should return allow request params', async () => {
    const res = await axios.get('/api/pets/1');
    expect(res.data.description).toEqual('getPetsById');
  });
});
