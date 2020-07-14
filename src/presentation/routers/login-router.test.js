const LoginRouter = require('./login-router');
const MissingParamError = require('../helpers/missing-param-error');

const makeSut = () => {
  return new LoginRouter();
};

describe('login Router', () => {
  it('should return 400 if no email provided', () => {
    const sut = makeSut();
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
    const sut = makeSut();
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
    const sut = makeSut();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should return 500 if no httpRequest has no body', () => {
    const sut = makeSut();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });
});
