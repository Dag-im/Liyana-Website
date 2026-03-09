import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { ApiEnvelope } from '../src/common/types/api-envelope.type';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }: { body: ApiEnvelope<string> }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBe('Hello World!');
        expect(body.error).toBeNull();
        expect(body.meta).toMatchObject({
          requestId: expect.any(String) as string,
          timestamp: expect.any(String) as string,
          version: 'v1',
        });
      });
  });
});
