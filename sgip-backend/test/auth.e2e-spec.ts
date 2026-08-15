import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
const request = require('supertest');
import { AppModule } from '../src/app.module';

describe('Acceder al perfil de usuario', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    // login test
    it('/POST auth/login', async () => {
        const userTest = {
            username: process.env.TEST_USER ?? 'josue.lopez',
            password: process.env.TEST_PWD ?? 'Admin123',
        };

        return request(app.getHttpServer())
            .post('/api/auth/login')
            .send(userTest)
            .expect(201)
            .then(({ body }) => {
                expect(body.access_token).toBeDefined();
                process.env.TOKEN = body.access_token;
            });
    });

    // UnAuthorized user profile
    it('/GET users/me - sin token debe retornar 401', () => {
        return request(app.getHttpServer())
            .get('/api/users/me')
            .expect(401);
    });

    // user profile con token
    it('/GET users/me - con token debe retornar 200', () => {
        return request(app.getHttpServer())
            .get('/api/users/me')
            .set('Authorization', `Bearer ${process.env.TOKEN}`)
            .expect(200)
            .then(({ body }) => {
                expect(body.username).toEqual(
                    process.env.TEST_USER ?? 'josue.lopez'
                );
            });
    });

    afterAll(async () => {
        await app.close();
    });
});