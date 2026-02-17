import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events.module';
import { AuthModule } from '../auth/auth.module';

describe('Events API (integration)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;
  let token: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoServer.getUri()),
        EventsModule,
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Test User', email: 'test@test.com', password: '123456' });

    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  const validEvent = {
    title: 'NestJS Workshop',
    description: 'Learn NestJS basics',
    date: '2026-04-15T14:00:00Z',
    location: 'Sala 1',
    category: 'workshop',
    organizer: 'Luis',
  };

  it('POST /events should create an event', async () => {
    const response = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send(validEvent)
      .expect(201);

    expect(response.body.title).toBe(validEvent.title);
    expect(response.body.status).toBe('draft');
    expect(response.body._id).toBeDefined();
  });

  it('POST /events should reject without token', async () => {
    await request(app.getHttpServer())
      .post('/events')
      .send(validEvent)
      .expect(401);
  });

  it('POST /events should reject invalid data', async () => {
    const response = await request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' })
      .expect(400);

    expect(response.body.message).toBeInstanceOf(Array);
  });

  it('GET /events should return created events', async () => {
    const response = await request(app.getHttpServer())
      .get('/events')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe(validEvent.title);
  });
});
