import MongoRepository from '@thzero/library_server_repository_mongo';

class RegistryMongoRepository extends MongoRepository {
	async _getCollectionRegistry(correlationId) {
		return await this._getCollectionFromConfig(correlationId, this._collectionsConfig.getCollectionRegistry());
	}

	async get(correlationId, name) {
		this._enforceNotEmpty('RegistryRepository', 'get', name, 'name', correlationId);

		try {
			const response = this._initResponse(correlationId);
	
			const collectionUsers = await this._getCollectionRegistry(correlationId);
			response.results = await this._findOne(correlationId, collectionUsers, {'id': name});
			response.success = response.results !== null;
	
			if (response.results)
				return this._successResponse(response.results, correlationId);

			return this._error('RegistryRepository', 'get', 'Not found.', null, null, null, correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'get', null, err, null, null, correlationId);
		}
	}

	async listing(correlationId) {
		try {
			// TODO: Refactor to support pagination,etc
			const collection = await this._getCollectionRegistry(correlationId);
			
			const response = await this._fetchExtract(correlationId, await this._find(correlationId, collection, null), this._initResponseExtract(correlationId));
			if (this._hasFailed(response))
				return response;

			return this._successResponse(response, correlationId);
		}
		catch (err) {
			return this._error('RegistryRepository', 'listing', null, err, null, null, correlationId);
		}
	}

	async update(correlationId, node) {
		this._enforceNotNull('RegistryRepository', 'update', node, 'node', correlationId);

		try {
			const response = this._initResponse(correlationId);
	
			const collection = await this._getCollectionRegistry(correlationId);
			const results = await collection.replaceOne({ 'name': node.name }, node, { upsert: true });
			if (!this._checkUpdate(correlationId, results))
				return this._error('BaseUserMongoRepository', 'updateFromExternal', 'Invalid user update.', null, null, null, correlationId);
			return response;
		}
		catch (err) {
			return this._error('RegistryRepository', 'update', null, err, null, null, correlationId);
		}
	}
}

export default RegistryMongoRepository;
