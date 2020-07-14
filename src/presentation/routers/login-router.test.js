const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');
const UnauthorizedError = require('../helpers/unauthorized-error');

const makeSut = () => {
  class AuthUseCaseSpy {
    auth(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy();
  const sut = new LoginRouter(authUseCaseSpy);
  return { sut, authUseCaseSpy };
};

describe('login Router', () => {
  it('should return 400 if no email provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: '123',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'email@mail.com',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 500 if no httpRequest no provided', () => {
    const { sut } = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should return 500 if no httpRequest has no body', () => {
    const { sut } = makeSut();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should call AuthUseCase with correct param', () => {
    const { sut, authUseCaseSpy } = makeSut();
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: '123123',
      },
    };
    sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  it('should return 401 when invalid credential are passed', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'invalid@mail.com',
        password: 'invalid_pass',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toStrictEqual(new UnauthorizedError());
  });

  it('should return 500 if no authUseCase is provided', () => {
    const sut = new LoginRouter();

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any_pass',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should return 500 if no authUseCase has no auth method', () => {
    class AuthUseCaseSpy {}
    const authUseCaseSpy = new AuthUseCaseSpy();

    const sut = new LoginRouter(authUseCaseSpy);

    const httpRequest = {
      body: {
        email: 'any@mail.com',
        password: 'any_pass',
      },
    };

    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
  });
});
