import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';

let mongoServer: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Note User', email: 'note@example.com', password: 'password123' });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (key === 'notes') await collections[key].deleteMany({});
  }
});

const auth = () => ({ Authorization: `Bearer ${token}` });

describe('Notes API', () => {
  it('should create a note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set(auth())
      .send({ title: 'Test Note', description: 'Test description', status: 'pending' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Note');
  });

  it('should get all notes', async () => {
    await request(app).post('/api/notes').set(auth()).send({ title: 'Note 1', description: 'Desc 1' });
    await request(app).post('/api/notes').set(auth()).send({ title: 'Note 2', description: 'Desc 2' });
    const res = await request(app).get('/api/notes').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should update a note', async () => {
    const created = await request(app)
      .post('/api/notes')
      .set(auth())
      .send({ title: 'Old Title', description: 'Old desc' });
    const id = created.body._id;
    const res = await request(app)
      .put(`/api/notes/${id}`)
      .set(auth())
      .send({ title: 'New Title', description: 'New desc', status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New Title');
    expect(res.body.status).toBe('completed');
  });

  it('should delete a note', async () => {
    const created = await request(app)
      .post('/api/notes')
      .set(auth())
      .send({ title: 'To Delete', description: 'Delete me' });
    const id = created.body._id;
    const res = await request(app).delete(`/api/notes/${id}`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Note deleted');
  });

  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.status).toBe(401);
  });

  it('should get stats', async () => {
    await request(app).post('/api/notes').set(auth()).send({ title: 'N1', description: 'D1', status: 'pending' });
    await request(app).post('/api/notes').set(auth()).send({ title: 'N2', description: 'D2', status: 'completed' });
    const res = await request(app).get('/api/notes/stats').set(auth());
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.completed).toBe(1);
    expect(res.body.pending).toBe(1);
  });
});
