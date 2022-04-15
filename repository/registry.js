import { Mutex as asyncMutex } from 'async-mutex';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

import Repository from '@thzero/library_server/repository/index';

import LibraryUtility from '@thzero/library_common/utility/index';

class RegistryRepository extends Repository {
	async init(injector) {
		await super.init(injector);

		this._mutexRegistry = new asyncMutex();

		this._registry = new Map();
	}

	async cleanup(correlationId, cleanupInterval) {
		throw new NotImplementedError();
	}

	async deregister(correlationId, name) {
		throw new NotImplementedError();
	}

	async get(correlationId, name) {
		throw new NotImplementedError();
	}

	async listing(correlationId) {
		throw new NotImplementedError();
	}

	async register(correlationId, node) {
		throw new NotImplementedError();
	}

	async update(correlationId, name, node, success) {
		throw new NotImplementedError();
	}
}

export default RegistryRepository;
