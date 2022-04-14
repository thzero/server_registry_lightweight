import { Mutex as asyncMutex } from 'async-mutex';

import RegistryRepository from '../registry';

import LibraryUtility from '@thzero/library_common/utility/index';

class InMemoryRegistryRepository extends RegistryRepository {
	constructor() {
		super();

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
				if (value.static)
					return;

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
		this._enforceNotEmpty('RegistryRepository', 'deregister', name, 'name', correlationId);

		if (!this._registry.has(name))
			return this._success(correlationId);

		const release = await this._mutexRegistry.acquire();
		try {
			if (!this._registry.has(name))
				return this._success(correlationId);

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
			this._enforceNotEmpty('RegistryRepository', 'get', name, 'name', correlationId);

			const results = this._registry.get(name);
			if (results)
				return this._successResponse(results, correlationId);

			return this._error('RegistryRepository', 'get', 'Not found.', null, null, null, correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'get', null, err, null, null, correlationId);
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
		this._enforceNotNull('RegistryRepository', 'register', node, 'node', correlationId);

		const release = await this._mutexRegistry.acquire();
		try {
			node.timestamp = LibraryUtility.getTimestamp();
			node.successes = 0;
			node.successesAccumulator = 0;
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

	async update(correlationId, name, node, success) {
		this._enforceNotEmpty('RegistryRepository', 'register', name, 'name', correlationId);
		this._enforceNotNull('RegistryRepository', 'register', node, 'node', correlationId);

		if (!this._registry.has(name))
			return this._success(correlationId);

		const release = await this._mutexRegistry.acquire();
		try {
			if (!this._registry.has(name))
				return this._success(correlationId);

			const node = this._registry.get(name);
			node.timestamp = LibraryUtility.getTimestamp();
			if (success) {
				node.successes += 1;
				if (node.successes === 1000000) {
					node.successesAccumulator +=1;
					node.successes = 0;
				}
			}
			else {
				node.successes = 0;
				node.successesAccumulator = 0;
			}
			this._registry.set(node.name, node);

			return this._success(correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'update', null, err, null, null, correlationId);
		}
		finally {
			release();
		}
	}

	_mapToArrayOfObj = m => {
		// return Array.from(m).map(([k, v]) => { v.name = k;  return { [k]: v } });
		return Array.from(m).map(([k, v]) => { v.name = k; return v });
	}

	_mapToObj = m => {
		return Array.from(m).reduce((obj, [key, value]) => {
			obj[key] = value;
			return obj;
		}, {});
	}
}

export default InMemoryRegistryRepository;
