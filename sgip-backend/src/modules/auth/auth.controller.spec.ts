import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    const mockAuthService = {
        login: jest.fn(),
        register: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('El controlador debe estar definido', () => {
        expect(controller).toBeDefined();
    });

    describe('Interacción entre controlador y servicio', () => {
        it('Debe retornar un access_token al hacer login', async () => {
            const mockUser = {
                id: 'user123',
                username: 'josue.lopez',
                role: 'ADMIN',
            };

            const mockToken = { access_token: 'jwt.token.here' };

            mockAuthService.login.mockResolvedValue(mockToken);

            const result = await controller.login({ user: mockUser } as any);

            expect(result).toEqual(mockToken);
            expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
        });

        it('Debe llamar al servicio register con los datos correctos', async () => {
            const registerDto = {
                name: 'Nuevo Usuario',
                username: 'nuevo.usuario',
                email: 'nuevo@sgip.mx',
                password: 'Pass1234',
                role: 'DEVELOPER' as any,
            };

            const mockResponse = {
                usuario: { id: 'abc', ...registerDto },
                access_token: 'jwt.token.here',
            };

            mockAuthService.register.mockResolvedValue(mockResponse);

            const result = await controller.register(registerDto);

            expect(result).toEqual(mockResponse);
            expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
        });
    });
});