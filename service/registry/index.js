import { Mutex as asyncMutex } from 'async-mutex';

import Constants from '../../constants.js';

import Repository from '@thzero/library_server/repository/index.js';

class RegistryRepository extends Repository {
	constructor() {
		super();

		this._repositoryRegistry = null;
	}

	async init(injector) {
		await super.init(injector);

		this._mutexRegistry = new asyncMutex();

		this._registry = new Map();

		this._repositoryRegistry = this._injector.getService(Constants.InjectorKeys.REPOSITORY_REGISTRY);
	}

	// eslint-disable-next-line no-unused-vars
	async cleanup(correlationId, cleanupInterval) {
		return this._repositoryRegistry.cleanup(correlationId, cleanupInterval);
	}

	// eslint-disable-next-line no-unused-vars
	async deregister(correlationId, name) {
		return this._repositoryRegistry.deregister(correlationId, name);
	}

	// eslint-disable-next-line no-unused-vars
	async get(correlationId, name) {
		return this._repositoryRegistry.get(correlationId, name);
	}

	// eslint-disable-next-line no-unused-vars
	async listing(correlationId) {
		return this._repositoryRegistry.listing(correlationId);
	}

	// eslint-disable-next-line no-unused-vars
	async register(correlationId, node) {
		return this._repositoryRegistry.register(correlationId, node);
	}

	// eslint-disable-next-line no-unused-vars
	async update(correlationId, name, node, success) {
		return this._repositoryRegistry.update(correlationId, name, node, success);
	}
}

export default RegistryRepository;
