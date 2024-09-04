import { StatusCodes } from 'http-status-codes';

class ResultError extends Error {
  private readonly _statusCode: StatusCodes;
  public constructor(errorMessage: string | any, statsCode: StatusCodes) {
    super(errorMessage);
    this._statusCode = statsCode;
  }

  public get StatusCode(): StatusCodes {
    return this._statusCode;
  }
}

export { ResultError };
