import { Err, Ok, Result } from 'neverthrow';
import { ResultError } from '../../../shared/utils/exceptions';
import { StatusCodes } from 'http-status-codes';

export const demoFunction = async (value: string): Promise<Result<string, ResultError>> => {
	if (!value) return new Err(new ResultError('Empty request', StatusCodes.BAD_REQUEST));

	return new Ok(value);
};
