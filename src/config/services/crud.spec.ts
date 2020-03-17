/// <reference types="intern" />

import { setupMocks, setupSinon } from '../../_support/mocks';

const { assert } = intern.getPlugin('chai');
const { describe, it, beforeEach } = intern.getPlugin('interface.bdd');

describe('config/services/crud', () => {
	describe('bootCrudService', () => {
		const sinon = setupSinon();
		const mockCrudService = sinon.stub();
		setupMocks({
			'../../core/services/crud.service': { crudService: mockCrudService }
		});
		let bootCrudService: typeof import('./crud').bootCrudService;

		beforeEach(() => {
			bootCrudService = require('./crud').bootCrudService;
			mockCrudService.returns({});
		});

		it('creates a crud route', async () => {
			const config = {
				path: '*'
			};

			const service = await bootCrudService(config);

			assert.isDefined(service);
			assert.isTrue(mockCrudService.calledOnce);
			assert.deepEqual(mockCrudService.firstCall.args[0], config);
		});

		it('creates a crud route with initial data', async () => {
			const config = {
				path: '*',
				data: { 'id-1': 'one' }
			};

			const service = await bootCrudService(config);

			assert.isDefined(service);
			assert.isTrue(mockCrudService.calledOnce);
			assert.deepEqual(mockCrudService.firstCall.args[0], config);
		});
	});
});
