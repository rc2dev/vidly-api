const request = require('supertest');

let server;

describe('/api/users', () => {
  let email;
  let password;

  beforeEach(() => {
    server = require('../../../index');

    email = 'email@example.com';
    password = '12345';
  });

  afterEach(async () => {
    await server.close();
  });

  describe('POST /', () => {
    const exec = () => {
      return request(server)
        .post('/api/auth')
        .send({ email, password });
    };

    it('should return 400 if email is not provided', async () => {
      email = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is less than 3 characters', async () => {
      email = 'ab';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is more than 50 characters', async () => {
      email = Array(52).join('');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if password is not provided', async () => {
      password = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
