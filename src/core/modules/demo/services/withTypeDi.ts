import { Service } from "typedi";
import { IServiceHandlerAsync } from "../../../shared/utils/services";
import { Err, Ok, Result } from "neverthrow";
import { ResultError } from "../../../shared/utils/exceptions";
import { StatusCodes } from "http-status-codes";

export interface IDemoService extends IServiceHandlerAsync<string,Result<string,ResultError>>{

}

@Service()
export class DemoService implements IDemoService{
    public async handleAsync(params: string): Promise<Result<string,ResultError>> {
        
        if(!params)
            return new Err(new ResultError("Empty request", StatusCodes.BAD_REQUEST));

        return new Ok(params);
    }

}