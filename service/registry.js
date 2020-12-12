import Constants from '../constants';

import Service from '@thzero/library_server/service/index';

class RegistryService extends Service {
	constructor() {
		super();

		this._repositoryRegistry = null;
	}

	async init(injector) {
		await super.init(injector);

		this._repositoryRegistry = this._injector.getService(Constants.InjectorKeys.REPOSITORY_REGISTRY);

		// TODO: remove ones that aren't heartbeated?
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

	async register(correlationId, node) {
		const validationNodes = this._serviceValidation.check(correlationId, this._serviceValidation.registeryRegisterSchema, node, null, 'node');
		if (!validationNodes.success)
			return validationNodes;

		const respositoryResponse = await this._repositoryRegistry.register(correlationId, node);
		return respositoryResponse;
	}
}

export default RegistryService;
