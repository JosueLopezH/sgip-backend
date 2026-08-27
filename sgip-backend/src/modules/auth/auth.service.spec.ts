import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';

describe('AuthService', () => {
    let service: AuthService;

    const mockUsersService = {
        findByUsername: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('El servicio debe estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('validateUser', () => {
        it('Debe retornar el usuario sin password cuando las credenciales son válidas', async () => {
            const password = crypto.createHash('sha256').update('Admin123').digest('hex');

            const mockUser = {
                id: 'user123',
                username: 'josue.lopez',
                email: 'josue@sgip.mx',
                password,
                role: 'ADMIN',
                active: true,
            };

            mockUsersService.findByUsername.mockResolvedValue(mockUser);

            const result = await service.validateUser('josue.lopez', 'Admin123');

            expect(result).toBeDefined();
            expect(result).not.toHaveProperty('password');
            expect(result.username).toEqual('josue.lopez');
        });

        it('Debe retornar null cuando el usuario no existe', async () => {
            mockUsersService.findByUsername.mockResolvedValue(null);

            const result = await service.validateUser('noexiste', 'Admin123');

            expect(result).toBeNull();
        });

        it('Debe retornar null cuando la contraseña es incorrecta', async () => {
            const password = crypto.createHash('sha256').update('Admin123').digest('hex');

            mockUsersService.findByUsername.mockResolvedValue({
                id: 'user123',
                username: 'josue.lopez',
                password,
            });

            const result = await service.validateUser('josue.lopez', 'WrongPassword');

            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('Debe retornar un access_token', async () => {
            const mockUser = { id: 'user123', username: 'josue.lopez', role: 'ADMIN' };
            mockJwtService.sign.mockReturnValue('jwt.token.signed');

            const result = await service.login(mockUser);

            expect(result).toEqual({ access_token: 'jwt.token.signed' });
            expect(mockJwtService.sign).toHaveBeenCalledWith({
                sub: mockUser.id,
                username: mockUser.username,
                role: mockUser.role,
            });
        });
    });
});