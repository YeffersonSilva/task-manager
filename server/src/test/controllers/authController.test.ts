
import request from 'supertest';
import {app} from '../../index.ts'; // Asegúrate de que la ruta sea correcta
import { connectDB, closeDB, clearDB } from '../setupTestDB.ts';

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Auth Controller', () => {
  it('debe registrar un nuevo usuario', async () => {
    const userData = {
      name: 'Usuario de Prueba',
      email: 'prueba@example.com',
      password: 'password123',
    };

    const res = await request(app).post('/api/auth/register').send(userData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.email).toBe(userData.email);
  });

  it('debe iniciar sesión un usuario existente', async () => {
    const userData = {
      name: 'Usuario de Prueba',
      email: 'prueba@example.com',
      password: 'password123',
    };

    // Primero, registrar al usuario
    await request(app).post('/api/auth/register').send(userData);

    // Luego, iniciar sesión
    const res = await request(app).post('/api/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
