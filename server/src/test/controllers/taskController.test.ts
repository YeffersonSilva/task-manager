import request from 'supertest';
import app from '../../app.ts'; // Asegúrate de que la ruta sea correcta
import { connectDB, closeDB, clearDB } from '../setupTestDB.ts';

let token: string;

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await closeDB();
});

afterEach(async () => {
  await clearDB();
});

const registerAndLogin = async () => {
  const userData = {
    name: 'Usuario de Prueba',
    email: 'prueba@example.com',
    password: 'password123',
  };

  // Registrar usuario
  await request(app).post('/api/auth/register').send(userData);

  // Iniciar sesión y obtener token
  const res = await request(app).post('/api/auth/login').send({
    email: userData.email,
    password: userData.password,
  });

  const token = res.body.token;
  return token;
};

describe('Task Controller', () => {
  beforeEach(async () => {
    token = await registerAndLogin();
  });

  it('debe crear una nueva tarea', async () => {
    const taskData = {
      title: 'Nueva Tarea',
      description: 'Descripción de la tarea',
    };

    const res = await request(app)
    .post('/api/tasks/task/create')
    .set('Authorization', `Bearer ${token}`)
    .send(taskData);
  

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(taskData.title);
    expect(res.body.description).toBe(taskData.description);
  });

  it('debe obtener todas las tareas del usuario autenticado', async () => {
    // Crear una tarea
    await request(app)
      .post('/api/tasks/task/create') // Ajustamos la ruta aquí
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tarea 1', description: 'Descripción 1' });

    const res = await request(app)
      .get('/api/tasks/tasks') // Esta ruta ya coincide
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0].title).toBe('Tarea 1');
  });
});
