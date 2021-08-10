import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import LocalAuthGuard from '../../../src/auth/localAuth.guard';
import { AuthController } from '../../../src/auth/auth.controller';
import { AuthService } from '../../../src/auth/auth.service';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let app: NestFastifyApplication;

  const loginMock = jest.fn(() => ({ access_token: 'TOKEN' }));
  const registerMock = jest.fn(() => ({ user: 'USER' }));
  const loginRequest = {
    id: '1',
    firstName: 'Bruce',
    lastName: 'Wayne',
    confirmed: true,
    email: 'bruce@wayne.co',
    password: 'iambatman',
  };
  const mockCanActivateLogin = jest.fn((ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    req.user = loginRequest;
    return true;
  });

  const authService = {
    login: loginMock,
    register: registerMock,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: mockCanActivateLogin })
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  describe('/POST login', () => {
    let res;

    beforeEach(async () => {
      res = await app.inject({
        method: 'POST',
        url: '/auth/login',
      });
    });

    it('posts to the correct path with the correct status', () => {
      expect(res.statusCode).toBe(201);
      expect(res.raw.req.method).toBe('POST');
      expect(res.raw.req.url).toBe('/auth/login');
    });

    it('calls login from authService with correct payload', () => {
      expect(loginMock).toHaveBeenCalledWith(loginRequest);
    });
  });

  describe('/POST register', () => {
    let res;
    const payload = {
      email: 'bruce@wayne.co',
      firstName: 'Bruce',
      lastName: 'Wayne',
      password: 'iambatman',
    };

    beforeAll(async () => {
      res = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload,
      });
    });

    it('is a post to the correct url with correct status', () => {
      expect(res.statusCode).toBe(201);
      expect(res.raw.req.method).toBe('POST');
      expect(res.raw.req.url).toBe('/auth/register');
    });

    it('calls register from authService with correct payload', () => {
      expect(registerMock).toHaveBeenCalledWith(payload);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
