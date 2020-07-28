module.exports = class ServerSideError extends Error {
  constructor() {
    super(`Internal Server Error`);
    this.name = 'ServerSideError';
  }
};
