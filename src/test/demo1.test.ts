// All Test Case Run
//node --trace-deprecation --test --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts

// Debug Mode with test.only Method
//node --trace-deprecation --test-only --require ts-node/register -r tsconfig-paths/register ./src/test/demo.test.ts

import test, { afterEach, describe } from 'node:test';
import expect from 'expect';
import * as sinon from 'sinon';

describe('Demo1 Test', () => {
	afterEach(() => {
		sinon.restore();
	});

	test(`should return false if guard clause failed`, async () => {
		expect(true).toBe(true);
	});

	test(`should return false if guard clause throw exception`, async () => {
		expect(false).toBe(true);
	});
});
