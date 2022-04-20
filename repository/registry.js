import { Mutex as asyncMutex } from 'async-mutex';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

import Repository from '@thzero/library_server/repository/index';

class RegistryRepository extends Repository {
	async init(injector) {
		await super.init(injector);

		this._mutexRegistry = new asyncMutex();

		this._registry = new Map();
	}

	// eslint-disable-next-line no-unused-vars
	async cleanup(correlationId, cleanupInterval) {
		throw new NotImplementedError();
	}

	// eslint-disable-next-line no-unused-vars
	async deregister(correlationId, name) {
		throw new NotImplementedError();
	}

	// eslint-disable-next-line no-unused-vars
	async get(correlationId, name) {
		throw new NotImplementedError();
	}

	// eslint-disable-next-line no-unused-vars
	async listing(correlationId) {
		throw new NotImplementedError();
	}

	// eslint-disable-next-line no-unused-vars
	async register(correlationId, node) {
		throw new NotImplementedError();
	}

	// eslint-disable-next-line no-unused-vars
	async update(correlationId, name, node, success) {
		throw new NotImplementedError();
	}
}

export default RegistryRepository;
