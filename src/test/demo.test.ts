// All Test Case Run
//node --trace-deprecation --test --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts

// Debug Mode with test.only Method
//node --trace-deprecation --test-only --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts

// Specific Test Case Run
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts

// If Debug not Worked then use
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register --inspect=4321 -r tsconfig-paths/register ./src/test/demo.test.ts
import 'reflect-metadata';
import test, { afterEach, beforeEach, describe } from 'node:test';
import expect from 'expect';
import Sinon, * as sinon from 'sinon';
import { DemoCommand, DemoCommandHandler, DemoRequestDTO } from '../core/modules/demo';
import { Err, Ok } from 'neverthrow';
import { ResultError } from '../core/shared/utils/exceptions';
import { StatusCodes } from 'http-status-codes';
import { DemoMediatorResponseDto } from '../core/modules/demo/services/withMediatR';
import * as demoFunction from '../core/modules/demo/services/withFunction';
import { faker } from '@faker-js/faker';

describe('Demo Test', () => {
	let _demoCommandHandler: DemoCommandHandler;

	beforeEach(() => {
		_demoCommandHandler = new DemoCommandHandler();
	});

	afterEach(() => {
		sinon.restore();
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if guard clause failed' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if guard clause failed`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		const command = new DemoCommand(request);

		const guardStub = sinon
			.stub(_demoCommandHandler as any, 'guard')
			.returns(new Err(new ResultError('Empty request', StatusCodes.BAD_REQUEST)));

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.BAD_REQUEST);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if guard clause throw exception' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if guard clause throw exception`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		const command = new DemoCommand(request);

		const guardStub = sinon
			.stub(_demoCommandHandler as any, 'guard')
			.throws(new ResultError('UnExpected Error', StatusCodes.INTERNAL_SERVER_ERROR));

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if mediator response failed' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if mediator response failed`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		request.id = faker.number.int({ min: 1, max: 100 });
		request.value = faker.string.alpha();
		const command = new DemoCommand(request);

		let guardStub = sinon.stub(_demoCommandHandler as any, 'guard').returns(new Ok(undefined));
		let getMediatorResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getMediatorResponse')
			.returns(
				new Err(new ResultError('UnExpected Error', StatusCodes.INTERNAL_SERVER_ERROR))
			);

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
		expect(getMediatorResponseStub.alwaysCalledWith(command)).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if mediator response throw exception' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if mediator response throw exception`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		request.id = faker.number.int({ min: 1, max: 100 });
		request.value = faker.string.alpha();
		const command = new DemoCommand(request);

		let guardStub = sinon.stub(_demoCommandHandler as any, 'guard').returns(new Ok(undefined));
		let getMediatorResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getMediatorResponse')
			.throws(new ResultError('UnExpected Error', StatusCodes.INTERNAL_SERVER_ERROR));

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
		expect(getMediatorResponseStub.alwaysCalledWith(command)).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if service response failed' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if service response failed`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		request.id = faker.number.int({ min: 1, max: 100 });
		request.value = faker.string.alpha();
		const command = new DemoCommand(request);

		let guardStub = sinon.stub(_demoCommandHandler as any, 'guard').returns(new Ok(undefined));
		let getMediatorResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getMediatorResponse')
			.resolves(new Ok(new DemoMediatorResponseDto()));
		let getServiceResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getServiceResponse')
			.returns(
				new Err(new ResultError('UnExpected Error', StatusCodes.INTERNAL_SERVER_ERROR))
			);

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
		expect(getMediatorResponseStub.alwaysCalledWith(command)).toBe(true);
		expect(getServiceResponseStub.alwaysCalledWith(command.request.value!)).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if service response throw exception' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if service response throw exception`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		request.id = faker.number.int({ min: 1, max: 100 });
		request.value = faker.string.alpha();
		const command = new DemoCommand(request);

		let guardStub = sinon.stub(_demoCommandHandler as any, 'guard').returns(new Ok(undefined));
		let getMediatorResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getMediatorResponse')
			.resolves(new Ok(new DemoMediatorResponseDto()));
		let getServiceResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getServiceResponse')
			.throws(new ResultError('UnExpected Error', StatusCodes.INTERNAL_SERVER_ERROR));

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
		expect(getMediatorResponseStub.alwaysCalledWith(command)).toBe(true);
		expect(getServiceResponseStub.alwaysCalledWith(command.request.value!)).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if demo function failed' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if demo function failed`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		request.id = faker.number.int({ min: 1, max: 100 });
		request.value = faker.string.alpha();
		const command = new DemoCommand(request);

		let guardStub = sinon.stub(_demoCommandHandler as any, 'guard').returns(new Ok(undefined));
		let getMediatorResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getMediatorResponse')
			.resolves(new Ok(new DemoMediatorResponseDto()));
		let getServiceResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getServiceResponse')
			.resolves(new Ok('test'));
		let demoFunctionStub = sinon
			.stub(demoFunction, 'demoFunction')
			.resolves(
				new Err(new ResultError('UnExpected Error', StatusCodes.INTERNAL_SERVER_ERROR))
			);

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
		expect(getMediatorResponseStub.alwaysCalledWith(command)).toBe(true);
		expect(getServiceResponseStub.alwaysCalledWith(command.request.value!)).toBe(true);
		expect(demoFunctionStub.alwaysCalledWith(command.request.value!)).toBe(true);
	});

	//node --trace-deprecation --test --test-name-pattern='should return false if demo function throws exception' --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts
	test(`should return false if demo function throws exception`, async () => {
		// Arrange
		const request = new DemoRequestDTO();
		request.id = faker.number.int({ min: 1, max: 100 });
		request.value = faker.string.alpha();
		const command = new DemoCommand(request);

		let guardStub = sinon.stub(_demoCommandHandler as any, 'guard').returns(new Ok(undefined));
		let getMediatorResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getMediatorResponse')
			.resolves(new Ok(new DemoMediatorResponseDto()));
		let getServiceResponseStub = sinon
			.stub(_demoCommandHandler as any, 'getServiceResponse')
			.resolves(new Ok('test'));
		let demoFunctionStub = sinon
			.stub(demoFunction, 'demoFunction')
			.throws(new ResultError('UnExpected Error', StatusCodes.INTERNAL_SERVER_ERROR));

		// Act
		const result = await _demoCommandHandler.handle(command);

		// Assert
		expect(result.Success).toBe(false);
		expect(result.StatusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(guardStub.alwaysCalledWith(command)).toBe(true);
		expect(getMediatorResponseStub.alwaysCalledWith(command)).toBe(true);
		expect(getServiceResponseStub.alwaysCalledWith(command.request.value!)).toBe(true);
		expect(demoFunctionStub.alwaysCalledWith(command.request.value!)).toBe(true);
	});
});
