import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('Should return registered user data', async () => {
    const body = {
        
        email: "utente@prova.it",
        firstName: "Utente",
        lastName: "Di Prova",
        password: "password",
        role: 0
        
    };
    const result = [
        {
            email: "utente@prova.it",
            firstName: "Utente",
            lastName: "Di Prova",
            role: 0,
            id: "1"
        }
    ];

    expect(controller.register(body)).toBe(result);
  });

});
