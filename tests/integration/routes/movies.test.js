const request = require('supertest');
const mongoose = require('mongoose');
const { Movie } = require('../../../models/movie');
const { Genre } = require('../../../models/genre');
const { User } = require('../../../models/user');

let server;

describe('/api/movies', () => {
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await server.close();
    await Movie.deleteMany({});
    await Genre.deleteMany({});
  });

  describe('POST /', () => {
    let token;
    let genre;
    let genreId;
    let payload;

    const exec = () => {
      return request(server)
        .post('/api/movies')
        .set('x-auth-token', token)
        .send(payload);
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();

      genreId = mongoose.Types.ObjectId().toHexString();
      genre = new Genre({
        _id: genreId,
        name: 'genre1'
      });
      await genre.save();

      payload = {
        title: 'movie1',
        genreId,
        numberInStock: 1,
        dailyRentalRate: 1
      };
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if title is not provided', async () => {
      payload.title = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if title is less than 3 characters', async () => {
      payload.title = 'aa';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if title is more than 255 characters', async () => {
      payload.title = new Array(257).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genreId is not provided', async () => {
      payload.genreId = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genreId is invalid', async () => {
      payload.genreId = 1;

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /:id', () => {
    let token;
    let movie;
    let genre;
    let genreId;
    let payload;

    const exec = () => {
      return request(server)
        .put(`/api/movies/{movieId}`)
        .set('x-auth-token', token)
        .send(payload);
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();

      genreId = mongoose.Types.ObjectId().toHexString();
      genre = new Genre({
        _id: genreId,
        name: 'genre1'
      });
      await genre.save();

      movieId = mongoose.Types.ObjectId().toHexString();
      movie = new Movie({
        _id: movieId,
        title: 'movie1',
        genre,
        numberInStock: 1,
        dailyRentalRate: 1
      });
      await movie.save();

      payload = {
        title: 'movie1',
        genreId,
        numberInStock: 1,
        dailyRentalRate: 2
      };
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if title is not provided', async () => {
      payload.title = '';

      const res = await exec();

      expect(res.status).toBe(400);
    });
  });
});
