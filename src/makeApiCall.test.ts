import axios from 'axios';

describe('msw and openapi-backend', () => {
  it('should work', async () => {
    const res = await axios.get('/api/pets');
    expect(res.status).toBe(200);
  });
});
