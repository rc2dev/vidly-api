const request = require('supertest');
const { Customer } = require('../../../models/customer');
const { User } = require('../../../models/user');

let server;

describe('/api/customers', () => {
  beforeEach(() => {
    server = require('../../../index');
  });

  afterEach(async () => {
    await server.close();
    await Customer.deleteMany({});
  });

  describe('POST /', () => {
    let token;
    let name;
    let phone;

    const exec = () => {
      return request(server)
        .post('/api/customers')
        .set('x-auth-token', token)
        .send({ name, phone });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();

      name = 'customer1';
      phone = '1234';
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if name is not provided', async () => {
      name = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is less than 3 characters', async () => {
      name = 'aa';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if name is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if phone is not provided', async () => {
      phone = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
