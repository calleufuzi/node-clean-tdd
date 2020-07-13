class LoginRouter {
  route(httpRequest) {
    if (!httpRequest || !httpRequest.body) return { statusCode: 500 };
    const { email, password } = httpRequest.body;
    if (!email || !password) {
      return {
        statusCode: 400,
      };
    }
  }
}

describe('login Router', () => {
  it('should return 400 if no email provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        password: '123',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });

  it('should return 400 if no password provided', () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: 'email@mail.com',
      },
    };
    const httpResponse = sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });

  it('should return 500 if no httpRequest no provided', () => {
    const sut = new LoginRouter();
    const httpResponse = sut.route();
    expect(httpResponse.statusCode).toBe(500);
  });

  it('should return 500 if no httpRequest has no body', () => {
    const sut = new LoginRouter();
    const httpResponse = sut.route({});
    expect(httpResponse.statusCode).toBe(500);
  });
});
