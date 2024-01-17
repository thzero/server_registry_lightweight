import BaseAppCollectionsService from '@thzero/library_server_repository_mongo/collections/index.js';

class AppCollectionsService extends BaseAppCollectionsService {
	getClientName() {
		return AppCollectionsService.Client;
	}

	getCollectionRegistry(correlationId) {
		return this._getCollection(correlationId, AppCollectionsService.Client, AppCollectionsService.Database, AppCollectionsService.CollectionRegistry);
	}

	static Client = 'atlas';
	static Database = 'mt';
	static CollectionRegistry = 'registry';
}

export default AppCollectionsService;
