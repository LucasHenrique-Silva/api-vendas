import app from '../src/shared/http/server';
import request from 'supertest';
import { getConnection } from 'typeorm';

describe('User', () => {
  beforeAll(async () => {
    const connection = await getConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = await getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it('Devera criar um usuario', async () => {
    const response = await request(app)
      .post('/customer')
      .send({ name: 'Lucas', email: 'Lucas313@mail.com' });
    expect(response.status).toBe(201);
  });
});
