const { MissingParamError, InvalidParamError } = require('../../utils/errors');

class AuthUseCase {
  constructor(LoadUserByEmailRepository) {
    this.loadUserByEmailRepository = LoadUserByEmailRepository;
  }

  async auth(email, password) {
    if (!email) throw new MissingParamError('email');
    if (!password) throw new MissingParamError('password');
    if (!this.loadUserByEmailRepository)
      throw new MissingParamError('loadUserByEmailRepository');
    if (!this.loadUserByEmailRepository.load)
      throw new InvalidParamError('loadUserByEmailRepository');

    const user = await this.loadUserByEmailRepository.load(email);
    if (!user) return null;
  }
}

const makeSut = () => {
  class LoadUserByEmailRepository {
    async load(email) {
      this.email = email;
    }
  }

  const LoadUserByEmailRepositorySpy = new LoadUserByEmailRepository();
  const sut = new AuthUseCase(LoadUserByEmailRepositorySpy);
  return { sut, LoadUserByEmailRepositorySpy };
};

describe('Auth UseCase', () => {
  it('should throw if no email is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth();
    await expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  it('should throw if no password is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@mail.com');
    await expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, LoadUserByEmailRepositorySpy } = makeSut();
    await sut.auth('any_email@mail.com', 'any_password');
    expect(LoadUserByEmailRepositorySpy.email).toBe('any_email@mail.com');
  });

  it('should throw if no repository is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.auth('any_email@mail.com', 'any_password');
    await expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepository')
    );
  });

  it('should throw if loadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({});
    const promise = sut.auth('any_email@mail.com', 'any_password');
    await expect(promise).rejects.toThrow(
      new InvalidParamError('loadUserByEmailRepository')
    );
  });

  it('should return null if repository returns null', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(
      'invalid_email@mail.com',
      'any_password'
    );

    expect(accessToken).toBeNull();
  });
});
