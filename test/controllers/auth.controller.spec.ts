import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

describe('AuthController', () => {
  let app: NestFastifyApplication;
  const authService = {
    login: jest.fn(() => ({ access_token: 'TOKEN' })),
  };

  beforeAll(async () => {
    console.log('before');
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();
    await app.getHttpServer().getInstance().ready();
  });

  it('/POST register', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/auth',
    });
    console.log(res);
  });
});
