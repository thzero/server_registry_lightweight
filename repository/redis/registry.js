import Redis from 'ioredis';
import { Mutex as asyncMutex } from 'async-mutex';

import Constants from '../../constants';

import RegistryRepository from '../registry';

import LibraryUtility from '@thzero/library_common/utility/index';

class RedisRegistryRepository extends RegistryRepository {
	constructor() {
		super();

		this._mutexRegistry = new asyncMutex();

		this._serviceRedis = null;
		this._serviceSearch = null;
	}

	async init(injector) {
		await super.init(injector);

		const url = this._config.get(`db.redis.connection`);
		this._serviceRedis = new Redis(url);
		
		this._serviceSearch = this._injector.getService(Constants.InjectorKeys.REPOSITORY_REGISTRY_SEARCH);
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
			let key = await this._serviceRedis.lpop('list');
			let value;
			while (key) {
				await this._serviceRedis.del(key);
				value = await this._serviceRedis.get(key);
				if (value)
					await this._serviceRedis.del(key);

				key = await this._serviceRedis.lpop('list');
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

		const release = await this._mutexRegistry.acquire();
		try {
			const node = await this._serviceRedis.get(node.name);
			if (node) {
				if (node.static)
				return this._success(correlationId);
			}

			await this._serviceRedis.del(node.name);
			const pos = await this._serviceRedis.lpos('list', node.name);
			if (pos) {
				await this._serviceRedis.lrem('list', node.name);
				await this._serviceRedis.srem('set', node);
			}

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

			const results = await this._serviceRedis.get(name);
			if (results)
				return this._successResponse(JSON.parse(results), correlationId);

			return this._error('RegistryRepository', 'get', 'Not found.', null, null, null, correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'get', null, err, null, null, correlationId);
		}
	}

	async listing(correlationId) {
		try {
			// TODO: Refactor to support pagination,etc
			//return this._successResponse(this._mapToArrayOfObj(this._serviceRedis.smembers('list')), correlationId);
			const response = await this._serviceSearch.listing(correlationId);
			if (this._hasFailed(response))
				return response;

			return this._successResponse(response.results.data, correlationId);
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
			const nodeR = JSON.stringify(node);
			await this._serviceRedis.set(node.name, nodeR);
			if (!node.static) {
				await this._serviceRedis.lpush('list', node.name);
				await this._serviceRedis.sadd('set', nodeR);
			}
			await this._serviceSearch.update(correlationId, node);

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

		const release = await this._mutexRegistry.acquire();
		try {
			const node = await this._serviceRedis.get(name);
			if (!node)
				return this._success(correlationId);

			const nodeJ = JSON.parse(node);
			await this._serviceRedis.srem('set', node);
			nodeJ.timestamp = LibraryUtility.getTimestamp();
			if (success) {
				nodeJ.successes += 1;
				if (nodeJ.successes === 1000000) {
					nodeJ.successesAccumulator +=1;
					nodeJ.successes = 0;
				}
			}
			else {
				nodeJ.successes = 0;
				nodeJ.successesAccumulator = 0;
			}
			await this._serviceRedis.set(node.name, JSON.stringify(JSON.stringify(node)));

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
		return Array.from(m).map(([k, v]) => { return JSON.parse(v); });
	}
}

export default RedisRegistryRepository;
