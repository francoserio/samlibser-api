import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../../src/users/user.entity';
import { UsersService } from '../../../src/users/users.service';

describe('UsersService', () => {
  const user = {
    id: '1',
    firstName: 'Bruce',
    lastName: 'Wayne',
    password: 'iambatman',
    confirmed: false,
    email: 'bruce@wayne.co',
  };

  const findOneMock = jest.fn(() => user);
  const createMock = jest.fn(() => user);
  const saveMock = jest.fn(() => true);

  const usersRepositoryMock = {
    findOne: findOneMock,
    create: createMock,
    save: saveMock,
  };
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepositoryMock,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('findOne', async () => {
    const res = await usersService.findOne('bruce@wayne.co');

    expect(findOneMock).toHaveBeenCalledWith({ email: 'bruce@wayne.co' });
    expect(res).toEqual(user);
  });

  it('create', async () => {
    const dto = {
      email: 'bruce@wayne.co',
      firstName: 'Bruce',
      lastName: 'Wayne',
    };

    const res = await usersService.create(dto);

    expect(createMock).toHaveBeenCalledWith(dto);
    expect(saveMock).toHaveBeenCalledWith(user);
    expect(res).toEqual(user);
  });
});
