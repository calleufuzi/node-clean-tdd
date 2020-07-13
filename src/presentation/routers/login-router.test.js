class LoginRouter {
  route(httpRequest) {
    if (!httpRequest.body.email) {
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
});
