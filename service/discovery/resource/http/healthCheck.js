import LibraryConstants from '@thzero/library_server/constants';

import Service from '@thzero/library_server/service/index';

class HttpHealthCheckLightweightResourceDiscoveryService extends Service {
	constructor() {
		super();

		this._serviceCommunicationRest = null;
	}

	async init(injector) {
		await super.init(injector);

		this._serviceCommunicationRest = this._injector.getService(LibraryConstants.InjectorKeys.SERVICE_COMMUNICATION_REST);
	}

	async perform(correlationId, resource) {
		this._enforceNotNull('HttpHealthCheckLightweightResourceDiscoveryService', 'perform', resource, 'resource', correlationId);
		this._enforceNotNull('HttpHealthCheckLightweightResourceDiscoveryService', 'perform', resource.healthCheck, 'resource.healthCheck', correlationId);

		if (String.isNullOrEmpty(resource.healthCheck.healthCheck)) {
			this._logger.warn('HttpHealthCheckLightweightResourceDiscoveryService', 'perform', 'No healthCheck url provided', correlationId);
			return this._error('HttpHealthCheckLightweightResourceDiscoveryService', 'perform', 'No healthCheck url provided.', null, null, null, correlationId);
		}

		const response = await this._serviceCommunicationRest.get(correlationId, null, resource.healthCheck.healthCheck, {
				resource: resource,
				correlationId: correlationId
			});
		this._logger.debug('HttpHealthCheckLightweightResourceDiscoveryService', 'perform', 'response', response, correlationId);

		return response;
	}
}

export default HttpHealthCheckLightweightResourceDiscoveryService;
