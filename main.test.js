const supertest = require('supertest');

const url = 'https://reqres.in';
const request = supertest(url);

describe('https://reqres.in tests', () => {
  it('GET list users', async () => {
    const response = await request.get('/api/users?page=2');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.body.page).toBe(2);
    expect(response.body.per_page).toBe(6);
    const objectEleven = response.body.data.filter(e => e.id === 11).pop();
    expect(objectEleven).not.toBeUndefined();
  });

  it('GET single user', async () => {
    const response = await request.get('/api/users/11');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.body.data.email).toMatch('@reqres.in');
    expect(response.body.data).toEqual(
      expect.objectContaining({
        avatar: expect.any(String),
        email: expect.any(String),
        first_name: expect.any(String),
        id: expect.any(Number),
        last_name: expect.any(String),
      }),
    );
  });

  it('POST create an user', async () => {
    const bodyToSend = {
      "name": "Peter",
      "job": "Sales"
    };
    const response = await request.post('/api/users').send(bodyToSend)
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.body).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        job: expect.any(String),
        id: expect.any(String),
        createdAt: expect.any(String),
      }),
    );
    expect(response.body).toEqual(expect.objectContaining(bodyToSend));
    expect(Date.parse(response.body.createdAt)).toBeLessThan(Date.now());
  });

  it('POST register unsuccessful', async () => {
    const bodyToSend = {
      "email": "Peter@reqres.in"
    };
    const response = await request.post('/api/register').send(bodyToSend)
    expect(response.status).toBe(400);
    expect(response.headers['content-type']).toMatch('application/json');
    expect(response.body).toEqual({
        error: 'Missing password'
    });
  });

  it('interact with 2 endpoints', async () => {
    const responseList = await request.get('/api/users?page=2');
    expect(responseList.status).toBe(200);
    const responseSingleUser = await request.get('/api/users/11');
    expect(responseSingleUser.status).toBe(200);
    const objectEleven = responseList.body.data.filter(e => e.id === 11).pop();
    expect(responseSingleUser.body.data).toEqual(objectEleven);
  });
});
