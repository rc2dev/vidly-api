const request = require('supertest');
const mongoose = require('mongoose');
const { Movie } = require('../../../models/movie');
const { Customer } = require('../../../models/customer');
const { User } = require('../../../models/user');

let server;

describe('/api/rentals', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await Movie.deleteMany({});
    await Customer.deleteMany({});
  });

  describe('POST /', () => {
    let token;
    let movieId;

    const exec = () => {
      return request(server)
        .post('/api/movies')
        .set('x-auth-token', token)
        .send({ movieId, customerId });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();

      movieId = mongoose.Types.ObjectId().toHexString();
      movie = new Movie({
        _id: movieId,
        title: 'movie1',
        genre: {
          name: 'genre1'
        },
        numberInStock: 1,
        dailyRentalRate: 1
      });
      await movie.save();

      customerId = mongoose.Types.ObjectId().toHexString();
      customer = new Customer({
        _id: customerId,
        name: 'abc',
        phone: '123'
      });
      await customer.save();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
      customerId = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
      movieId = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
