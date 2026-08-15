import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
const request = require('supertest');
import { AppModule } from '../../src/app.module';

describe('Users E2E', () => {
    let app: INestApplication;
    let token: string;
    let userId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        // Login para obtener token
        const loginRes = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                username: process.env.TEST_USER ?? 'josue.lopez',
                password: process.env.TEST_PWD ?? 'Admin123',
            });

        token = loginRes.body.access_token;
    });

    describe('GET /api/users', () => {
        it('Debe retornar 401 sin token', () => {
            return request(app.getHttpServer())
                .get('/api/users')
                .expect(401);
        });

        it('Debe retornar lista de usuarios con token', () => {
            return request(app.getHttpServer())
                .get('/api/users')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(({ body }) => {
                    expect(Array.isArray(body)).toBe(true);
                });
        });
    });

    describe('GET /api/users/me', () => {
        it('Debe retornar el perfil del usuario autenticado', () => {
            return request(app.getHttpServer())
                .get('/api/users/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.username).toEqual(
                        process.env.TEST_USER ?? 'josue.lopez'
                    );
                    expect(body).not.toHaveProperty('password');
                    userId = body.id;
                });
        });
    });

    describe('PATCH /api/users/:id', () => {
        it('Debe actualizar el nombre del usuario', () => {
            return request(app.getHttpServer())
                .patch(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'Josue López Actualizado' })
                .expect(200)
                .then(({ body }) => {
                    expect(body.name).toEqual('Josue López Actualizado');
                });
        });

        it('Debe retornar 400 con rol inválido', () => {
            return request(app.getHttpServer())
                .patch(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ role: 'SUPERADMIN' })
                .expect(400);
        });
    });

    describe('GET /api/users/:id', () => {
        it('Debe retornar 404 con id inexistente', () => {
            return request(app.getHttpServer())
                .get('/api/users/id-que-no-existe')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});