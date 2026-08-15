import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

describe('ProjectsController', () => {
    let controller: ProjectsController;

    const mockProject = {
        id: 'proj123',
        name: 'SGIP v1.0',
        description: 'Sistema de gestión',
        status: 'PENDING',
        budget: 50000,
        createdAt: new Date(),
        manager: { id: 'user123', name: 'Josue', username: 'josue.lopez' },
        tasks: [],
    };

    const mockProjectsService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectsController],
            providers: [
                { provide: ProjectsService, useValue: mockProjectsService },
            ],
        }).compile();

        controller = module.get<ProjectsController>(ProjectsController);
    });

    it('El controlador debe estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('Interacción entre controlador y servicio', () => {
        it('findAll debe retornar la lista de proyectos del servicio', async () => {
            const mockResult = { data: [mockProject], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } };
            mockProjectsService.findAll.mockResolvedValue(mockResult);

            const result = await controller.findAll();

            expect(result).toEqual(mockResult);
            expect(mockProjectsService.findAll).toHaveBeenCalled();
        });

        it('findOne debe retornar un proyecto por ID', async () => {
            mockProjectsService.findOne.mockResolvedValue(mockProject);

            const result = await controller.findOne('proj123');

            expect(result).toEqual(mockProject);
            expect(mockProjectsService.findOne).toHaveBeenCalledWith('proj123');
        });

        it('create debe retornar el proyecto creado', async () => {
            const createDto = {
                name: 'Nuevo Proyecto',
                managerId: 'user123',
            } as any;

            mockProjectsService.create.mockResolvedValue(mockProject);

            const result = await controller.create(createDto);

            expect(result).toEqual(mockProject);
            expect(mockProjectsService.create).toHaveBeenCalledWith(createDto);
        });

        it('update debe retornar el proyecto actualizado', async () => {
            const updateDto = { status: 'IN_PROCESS' as any };
            const updatedProject = { ...mockProject, status: 'IN_PROCESS' };

            mockProjectsService.update.mockResolvedValue(updatedProject);

            const result = await controller.update('proj123', updateDto);

            expect(result.status).toEqual('IN_PROCESS');
            expect(mockProjectsService.update).toHaveBeenCalledWith('proj123', updateDto);
        });

        it('remove debe retornar mensaje de confirmación', async () => {
            mockProjectsService.remove.mockResolvedValue({ mensaje: 'Proyecto eliminado correctamente' });

            const result = await controller.remove('proj123');

            expect(result).toEqual({ mensaje: 'Proyecto eliminado correctamente' });
            expect(mockProjectsService.remove).toHaveBeenCalledWith('proj123');
        });
    });
});