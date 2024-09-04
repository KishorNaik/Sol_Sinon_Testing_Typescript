import { validateOrReject, ValidationError } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { Err, Ok, Result } from "neverthrow";
import { ResultError } from "../utils/exceptions";

export async function validateOrRejectAsync<TDto>(input:TDto) : Promise<Result<unknown,ResultError>> {
    try {
      await validateOrReject(input as object, { skipMissingProperties: true });

      return new Ok("ok");
    } catch (errors) {

      const errorsArray = errors as ValidationError[];
      const message = errorsArray.map((error: ValidationError) => Object.values(error.constraints!)).join(', ');
      return new Err(new ResultError(message, StatusCodes.BAD_REQUEST));
    }
}