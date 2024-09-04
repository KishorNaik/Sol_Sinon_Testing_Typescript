import { IRequest, IRequestHandler, requestHandler } from "mediatr-ts";
import { DataResponse, DataResponseFactory } from "../../../shared/models/response";
import { sealed } from "../../../shared/utils/sealed";
import { StatusCodes } from "http-status-codes";
import { ResultError } from "../../../shared/utils/exceptions";
import { Err, Ok, Result } from "neverthrow";

export class DemoMediatorRequestDto{
    public id?:number;
}

export class DemoMediatorResponseDto{
    public id?:number;
}

export class DemoMediatorCommand implements IRequest<DataResponse<DemoMediatorResponseDto>>{
    private readonly _request: DemoMediatorRequestDto;
    public constructor(request: DemoMediatorRequestDto) {
        this._request = request;            
    }

    public get request(): DemoMediatorRequestDto {
        return this._request;
    }
}

@sealed
@requestHandler(DemoMediatorCommand)
export class DemoMediatorCommandHandler implements IRequestHandler<DemoMediatorCommand, DataResponse<DemoMediatorResponseDto>>{    
    protected guard(value: DemoMediatorCommand): Result<unknown, ResultError> {

        if(!value)
            return new Err(new ResultError("Empty object", StatusCodes.BAD_REQUEST));

        if(!value.request)
            return new Err(new ResultError("Empty request", StatusCodes.BAD_REQUEST));

        return new Ok(undefined);
    }

    public async handle(value: DemoMediatorCommand): Promise<DataResponse<DemoMediatorResponseDto>> {
        try
        {
            const guardResult=this.guard(value);
            if(guardResult.isErr())
                return DataResponseFactory.Response(false, guardResult.error.StatusCode, null!, guardResult.error.message);

            return DataResponseFactory.Response(true, StatusCodes.OK, value.request);
        }
        catch(ex){
            const err= ex as Error;
            return DataResponseFactory.Response(false, StatusCodes.INTERNAL_SERVER_ERROR, null!, err.message);
        }
    }

}