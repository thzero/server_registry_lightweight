import Constants from '../../../constants';

import LibraryUtility from '@thzero/library_common/utility';

import Service from '@thzero/library_server/service/index';

class LoaderLightweightResourceDiscoveryService extends Service {
	constructor() {
		super();

		this._serviceResourceDiscovery = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceResourceDiscovery = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
	}

	async load(correlationId) {
		const resources = this._config.get('discovery.resources', null);
		if (!resources)
			return this._success(correlationId);

		try {
			if (!Array.isArray(resources))
				return this._error('LoaderLightweightResourceDiscoveryService', 'load', 'Resources is not an array.', null, null, null, correlationId);

			this._logger.info2(`Loading configured resources...`, null, correlationId);

			let response = null;
			let node = null;
			for(const resource of resources) {
				node = LibraryUtility.cloneDeep(resource);
				node.static = true;
				this._logger.info2(`\tresource: ${node.name}`, null, correlationId);
				response = await this._serviceResourceDiscovery.register(correlationId, node);
				if (!response.success)
					this._logger.info2(`\t\t...failed to load`, null, correlationId);
			}
		}
		finally {
			this._logger.info2(`...loaading configured resources completed.`, null, correlationId);
		}

		return this._success(correlationId);
	}
}

export default LoaderLightweightResourceDiscoveryService;
