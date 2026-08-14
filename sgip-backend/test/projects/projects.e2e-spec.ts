import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
const request = require('supertest');
import { AppModule } from '../../src/app.module';

describe('Projects E2E', () => {
    let app: INestApplication;
    let token: string;
    let projectId: string;
    let managerId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        const loginRes = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                username: process.env.TEST_USER ?? 'josue.lopez',
                password: process.env.TEST_PWD ?? 'Admin123',
            });

        token = loginRes.body.access_token;

        const meRes = await request(app.getHttpServer())
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        managerId = meRes.body.id;
    });

    describe('POST /api/projects', () => {
        it('Debe crear un proyecto correctamente', () => {
            return request(app.getHttpServer())
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    name: 'Proyecto Test E2E',
                    description: 'Proyecto creado en pruebas E2E',
                    status: 'PENDING',
                    budget: 10000,
                    startDate: '2026-07-01',
                    endDate: '2026-12-31',
                    managerId,
                })
                .expect(201)
                .then(({ body }) => {
                    expect(body.name).toEqual('Proyecto Test E2E');
                    expect(body.manager).toBeDefined();
                    projectId = body.id;
                });
        });

        it('Debe retornar 400 sin campo name', () => {
            return request(app.getHttpServer())
                .post('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .send({ managerId })
                .expect(400);
        });

        it('Debe retornar 401 sin token', () => {
            return request(app.getHttpServer())
                .post('/api/projects')
                .send({ name: 'Test', managerId })
                .expect(401);
        });
    });

    describe('GET /api/projects', () => {
        it('Debe retornar lista paginada de proyectos', () => {
            return request(app.getHttpServer())
                .get('/api/projects')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.data).toBeDefined();
                    expect(body.meta).toBeDefined();
                    expect(body.meta.total).toBeGreaterThan(0);
                });
        });

        it('Debe filtrar por status PENDING', () => {
            return request(app.getHttpServer())
                .get('/api/projects?status=PENDING')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(({ body }) => {
                    body.data.forEach((p: any) => {
                        expect(p.status).toEqual('PENDING');
                    });
                });
        });
    });

    describe('GET /api/projects/:id', () => {
        it('Debe retornar el proyecto por ID', () => {
            return request(app.getHttpServer())
                .get(`/api/projects/${projectId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.id).toEqual(projectId);
                    expect(body.tasks).toBeDefined();
                });
        });

        it('Debe retornar 404 con ID inexistente', () => {
            return request(app.getHttpServer())
                .get('/api/projects/id-falso-123')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });

    describe('PATCH /api/projects/:id', () => {
        it('Debe actualizar el status del proyecto', () => {
            return request(app.getHttpServer())
                .patch(`/api/projects/${projectId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ status: 'IN_PROCESS' })
                .expect(200)
                .then(({ body }) => {
                    expect(body.status).toEqual('IN_PROCESS');
                });
        });
    });

    describe('DELETE /api/projects/:id', () => {
        it('Debe eliminar el proyecto', () => {
            return request(app.getHttpServer())
                .delete(`/api/projects/${projectId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(({ body }) => {
                    expect(body.mensaje).toEqual('Proyecto eliminado correctamente');
                });
        });
    });

    afterAll(async () => {
        await app.close();
    });
});