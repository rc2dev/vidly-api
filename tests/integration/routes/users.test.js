const request = require('supertest');
const { User } = require('../../../models/user');

let server;

describe('/api/users', () => {
  let name;
  let email;
  let password;

  beforeEach(() => {
    server = require('../../../index');

    name = 'name1';
    email = 'email@example.com';
    password = '12345';
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  describe('POST /', () => {
    const exec = () => {
      return request(server)
        .post('/api/users')
        .send({ name, email, password });
    };

    it('should return 400 if name is not provided', async () => {
      name = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is less than 3 characters', async () => {
      name = 'ab';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 50 characters', async () => {
      name = Array(52).join('');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if email is not provided', async () => {
      email = '';

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
