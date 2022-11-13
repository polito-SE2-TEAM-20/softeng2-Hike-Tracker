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

  it('Should return user data and 1 token', async () => {
    const body = {
        
        email: "utente@prova.it",
        password: "password"
        
    };
    const result = [
        {
            user: {
                id: 1,
                email: "utente@prova.it",
                firstName: "Utente",
                lastName: "Di Prova",
                role: 0
            },
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY4MzYyNDQ0fQ.Iijf5rzdqQhXjE8-oSB5EzFL7IkAo1gMvbO7Ug3LXbQ"
        }
    ];

    expect(controller.login(body)).toBe(result);
  });
});
