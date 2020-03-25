const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');

describe('/api/returns', () => {
  let server;
  let rental;
  let movie;
  let customerId;
  let movieId;
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require('../../index');
    customerId = mongoose.Types.ObjectId().toHexString();
    movieId = mongoose.Types.ObjectId().toHexString();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '123',
      dailyRentalRate: 2,
      genre: { name: '123' },
      numberInStock: 10
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '123',
        phone: '123'
      },
      movie: {
        _id: movieId,
        title: '123',
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
    await Movie.deleteMany({});
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

  it('should return 404 if no rental found for this customer/movie', async () => {
    await Rental.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if valid request', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the return date if valid request', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = rentalInDb.dateReturned - new Date();
    expect(diff).toBeLessThan(10 * 1000); // 10 seconds
  });

  it('should set the rental fee if valid request', async () => {
    // As we just created the rental object in the DB, dateOut will be just some
    // seconds ago. Let's modify this in the DB before calling the endpoint, so
    // it was rented some days ago.
    rental.dateOut = moment()
      .add(-7, 'days')
      .toDate();
    rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(14);
  });

  it('should increase the stock of the movie if valid request', async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should return the rental if valid request', async () => {
    const res = await exec();

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'customer',
        'movie',
        'dateOut',
        'dateReturned',
        'rentalFee'
      ])
    );
  });
});
