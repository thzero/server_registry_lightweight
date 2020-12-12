import { Mutex as asyncMutex } from 'async-mutex';

import Repository from '@thzero/library_server/repository';

import Utility from '@thzero/library_common/utility';

class RegistryRepository extends Repository {
	async init(injector) {
		await super.init(injector);

		this._mutexRegistry = new asyncMutex();

		this._registry = new Map();
	}

	async cleanup(correlationId, name) {
		const release = await this._mutexRegistry.acquire();
		try {
			this._enforceNotNull('RegistryRepository', 'cleanup', node, 'node', correlationId);

			this._registry.clear();

			return this._success(correlationId);
		}
		catch(err) {
			return this._error('RegistryRepository', 'cleanup', null, err, null, null, correlationId);
		}
		finally {
			release();
		}
	}

	async deregister(correlationId, name) {
		const release = await this._mutexRegistry.acquire();
		try {
			this._enforceNotNull('RegistryRepository', 'deregister', name, 'name', correlationId);

            this._registry.delete(name);

			return this._success(correlationId);
		}
		catch(err) {
			return this._error('RegistryRepository', 'deregister', null, err, null, null, correlationId);
		}
		finally {
			release();
		}
	}

	async get(correlationId, name) {
		try {
			this._enforceNotNull('RegistryRepository', 'get', node, 'node', correlationId);

			return this._successResponse(correlationId, this._registry.get(name));
		}
		catch(err) {
			return this._error('RegistryRepository', 'get', null, err, null, null, correlationId);
		}
	}

	async heartbeat(correlationId) {
		const release = await this._mutexRegistry.acquire();
		try {
			return this._success(correlationId);
		}
		catch(err) {
			return this._error('RegistryRepository', 'heartbeat', null, err, null, null, correlationId);
		}
		finally {
			release();
		}
	}

	async register(correlationId, node) {
		const release = await this._mutexRegistry.acquire();
		try {
			this._enforceNotNull('RegistryRepository', 'register', node, 'node', correlationId);

			node.timestamp = Utility.getTimestamp();
            this._registry.set(node.name, node);

			return this._success(correlationId);
		}
		catch(err) {
			return this._error('RegistryRepository', 'register', null, err, null, null, correlationId);
		}
		finally {
			release();
		}
	}
}

export default RegistryRepository;
