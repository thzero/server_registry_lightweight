import Service from '@thzero/library_server/service/index.js';

class GrpcHealthCheckLightweightResourceDiscoveryService extends Service {
	constructor() {
		super();
	}

	async perform(correlationId, resource) {
		this._enforceNotNull('GrpcHealthCheckLightweightResourceDiscoveryService', 'perform', resource, 'resource', correlationId);

		if (!resource.grpc) {
			this._logger.warn('GrpcHealthCheckLightweightResourceDiscoveryService', 'perform', 'No grpc resource provided', correlationId);
			return this._error('GrpcHealthCheckLightweightResourceDiscoveryService', 'perform', 'No grpc resource provided.', null, null, null, correlationId);
		}

		// TODO

		return this._success(correlationId);
	}
}

export default GrpcHealthCheckLightweightResourceDiscoveryService;
