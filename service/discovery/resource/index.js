import Constants from '../../../constants';

import LibraryUtility from '@thzero/library_common/utility';

import Service from '@thzero/library_server/service/index';

class LightweightResourceDiscoveryService extends Service {
	constructor() {
		super();

		this._repositoryRegistry = null;
	}

	async init(injector) {
		await super.init(injector);

		this._repositoryRegistry = this._injector.getService(Constants.InjectorKeys.REPOSITORY_REGISTRY);

		const cleanupInterval = Number(this._config.get('registry.cleanupInterval', 45)) || 45;
		const heartbeatInterval = Number(this._config.get('registry.heartbeatInterval', 15)) || 15;
		this.timer = setInterval((async function () {
			let correlationId = null;
			try {
				correlationId = LibraryUtility.generateId();
				await this._repositoryRegistry.cleanup(correlationId, cleanupInterval);
			}
			catch(err) {
				this._logger.exception('LightweightResourceDiscoveryService', '_initServer', err, correlationId);
			}
		}).bind(this), heartbeatInterval * 1000);
	}

	async deregister(correlationId, name) {
		const validationName = this._serviceValidation.check(correlationId, this._serviceValidation.registeryNameSchema, name, null, 'name');
		if (!validationName.success)
			return validationName;

		const respositoryResponse = await this._repositoryRegistry.deregister(correlationId, name);
		return respositoryResponse;
	}

	async get(correlationId, name) {
		const validationName = this._serviceValidation.check(correlationId, this._serviceValidation.registeryNameSchema, name, null, 'name');
		if (!validationName.success)
			return validationName;

		const respositoryResponse = await this._repositoryRegistry.get(correlationId, name);
		return respositoryResponse;
	}

	async listing(correlationId, filters) {
		// TODO: filters
		// const validationName = this._serviceValidation.check(correlationId, this._serviceValidation.filterSchema, filters, null, 'filters');
		// if (!validationName.success)
		// 	return validationName;

		const respositoryResponse = await this._repositoryRegistry.listing(correlationId, filters);
		return respositoryResponse;
	}

	async register(correlationId, node) {
		const validationNodes = this._serviceValidation.check(correlationId, this._serviceValidation.registeryRegisterSchema, node, null, 'node');
		if (!validationNodes.success)
			return validationNodes;

		const respositoryResponse = await this._repositoryRegistry.register(correlationId, node);
		return respositoryResponse;
	}
}

export default LightweightResourceDiscoveryService;
