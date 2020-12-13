import { Mutex as asyncMutex } from 'async-mutex';

import Repository from '@thzero/library_server/repository';

import LibraryUtility from '@thzero/library_common/utility';

class RegistryRepository extends Repository {
	async init(injector) {
		await super.init(injector);

		this._mutexRegistry = new asyncMutex();

		this._registry = new Map();
	}

	async cleanup(correlationId, cleanupInterval) {
		const release = await this._mutexRegistry.acquire();
		try {
			if (!cleanupInterval) {
				this._registry.clear();
				return this._success(correlationId);
			}

			cleanupInterval = cleanupInterval * 1000;

			this._logger.info2(`HEARTBEAT for CLEANUP`, null, correlationId);
			const now = LibraryUtility.getTimestamp();
			const deletable = [];
			let delta = 0;
			this._registry.forEach((value, key, map) => {
				delta = now - value.timestamp;
				if (delta <= cleanupInterval)
					return;

				deletable.push(key);
			});

			for(const key of deletable) {
				this._logger.info2(`\tremove stale name: '${key}'`, null, correlationId);
				this._registry.delete(key);
			}

			return this._success(correlationId);
		}
		catch (err) {
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
		catch (err) {
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
		catch (err) {
			return this._error('RegistryRepository', 'get', null, err, null, null, correlationId);
		}
	}

	async heartbeat(correlationId) {
		const release = await this._mutexRegistry.acquire();
		try {
			return this._success(correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'heartbeat', null, err, null, null, correlationId);
		}
		finally {
			release();
		}
	}

	async listing(correlationId) {
		try {
			return this._successResponse(this._mapToArrayOfObj(this._registry), correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'listing', null, err, null, null, correlationId);
		}
	}

	async register(correlationId, node) {
		const release = await this._mutexRegistry.acquire();
		try {
			this._enforceNotNull('RegistryRepository', 'register', node, 'node', correlationId);

			node.timestamp = LibraryUtility.getTimestamp();
			this._registry.set(node.name, node);

			return this._success(correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'register', null, err, null, null, correlationId);
		}
		finally {
			release();
		}
	}

	_mapToArrayOfObj = m => {
		// return Array.from(m).map(([k, v]) => { v.name = k;  return { [k]: v } });
		return Array.from(m).map(([k, v]) => { v.name = k;  return v });
	}

	_mapToObj = m => {
		return Array.from(m).reduce((obj, [key, value]) => {
			obj[key] = value;
			return obj;
		}, {});
	}
}

export default RegistryRepository;
