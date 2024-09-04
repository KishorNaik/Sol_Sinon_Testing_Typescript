import { IRequest, IRequestHandler, requestHandler } from 'mediatr-ts';
import { DataResponse, DataResponseFactory } from '../../shared/models/response';
import { sealed } from '../../shared/utils/sealed';
import { Err, Ok, Result } from 'neverthrow';
import { ResultError } from '../../shared/utils/exceptions';
import { StatusCodes } from 'http-status-codes';
import {
	DemoMediatorCommand,
	DemoMediatorRequestDto,
	DemoMediatorResponseDto,
} from './services/withMediatR';
import mediatR from '../../shared/mediatR';
import { DemoService, IDemoService } from './services/withTypeDi';
import Container from 'typedi';
import { demoFunction } from './services/withFunction';

export class DemoRequestDTO {
	public id?: number;
	public value?: string;
}

export class DemoResponseDTO {
	public id?: number;
	public value?: string;
}

export class DemoCommand implements IRequest<DataResponse<DemoResponseDTO>> {
	private readonly _request: DemoRequestDTO;

	public constructor(request: DemoRequestDTO) {
		this._request = request;
	}

	public get request(): DemoRequestDTO {
		return this._request;
	}
}

@sealed
@requestHandler(DemoCommand)
export class DemoCommandHandler
	implements IRequestHandler<DemoCommand, DataResponse<DemoResponseDTO>>
{
	private readonly _demoService: IDemoService;

	public constructor() {
		this._demoService = Container.get(DemoService);
	}

	protected guard(value: DemoCommand): Result<unknown, ResultError> {
		if (!value) return new Err(new ResultError('Empty request', StatusCodes.BAD_REQUEST));

		if (!value.request)
			return new Err(new ResultError('Empty request', StatusCodes.BAD_REQUEST));

		return new Ok(undefined);
	}

	protected async getMediatorResponse(
		value: DemoCommand
	): Promise<Result<DemoMediatorResponseDto, ResultError>> {
		const demoMediatorRequestDto = new DemoMediatorRequestDto();
		demoMediatorRequestDto.id = value?.request?.id;

		const mediatorResponse = await mediatR.send<DataResponse<DemoMediatorResponseDto>>(
			new DemoMediatorCommand(demoMediatorRequestDto)
		);
		if (!mediatorResponse.Success)
			return new Err(new ResultError(mediatorResponse.Message, mediatorResponse.StatusCode!));

		return new Ok(mediatorResponse.Data!);
	}

	protected async getServiceResponse(value: string): Promise<Result<string, ResultError>> {
		if (!value) return new Err(new ResultError('Empty request', StatusCodes.BAD_REQUEST));

		const serviceResponse = await this._demoService.handleAsync(value);
		if (serviceResponse.isErr())
			return new Err(
				new ResultError(serviceResponse.error.message, serviceResponse.error.StatusCode)
			);

		return new Ok(serviceResponse.value);
	}

	public async handle(value: DemoCommand): Promise<DataResponse<DemoResponseDTO>> {
		try {
			const guardResult = this.guard(value);
			if (guardResult.isErr())
				return DataResponseFactory.Response(
					false,
					guardResult.error.StatusCode,
					null!,
					guardResult.error.message
				);

			const mediatorResponse = await this.getMediatorResponse(value);
			if (mediatorResponse.isErr())
				return DataResponseFactory.Response(
					false,
					mediatorResponse.error.StatusCode,
					null!,
					mediatorResponse.error.message
				);

			const serviceResponse = await this.getServiceResponse(value.request.value!);
			if (serviceResponse.isErr())
				return DataResponseFactory.Response(
					false,
					serviceResponse.error.StatusCode,
					null!,
					serviceResponse.error.message
				);

			const demoFunctionResponse = await demoFunction(value.request.value!);
			if (demoFunctionResponse.isErr())
				return DataResponseFactory.Response(
					false,
					demoFunctionResponse.error.StatusCode,
					null!,
					demoFunctionResponse.error.message
				);

			return DataResponseFactory.Response(true, StatusCodes.OK, value.request);
		} catch (ex) {
			const err = ex as Error;
			return DataResponseFactory.Response(
				false,
				StatusCodes.INTERNAL_SERVER_ERROR,
				null!,
				err.message
			);
		}
	}
}
