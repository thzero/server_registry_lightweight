import { Mutex as asyncMutex } from 'async-mutex';

import Constants from '../../../../constants.js';

import ServerBaseGrpcService from '@thzero/library_server_service_grpc/server.js';

import registryMessages from '@thzero/library_server_service_discovery_resources_lightweight_proto/binary/registry_pb.cjs';
import registryServices from '@thzero/library_server_service_discovery_resources_lightweight_proto/binary/registry_grpc_pb.cjs';

class LightweightResourceDiscoveryGrpcService extends ServerBaseGrpcService {
	constructor() {
		super();

		this._mutex = new asyncMutex();

		this._client = null;

		this._resourceDiscoveryService = null;
	}

	async _initServices() {
		this._resourceDiscoveryService = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);

		this._grpc.addService(registryServices.RegistryService, {
			deregister: this.deregister.bind(this),
			get: this.getService.bind(this),
			register: this.register.bind(this)
		});
	}

	deregister(call, callback) {
		this._enforceNotNull('LightweightResourceDiscoveryGrpcService', 'deregister', call, 'call');
		this._enforceNotNull('LightweightResourceDiscoveryGrpcService', 'deregister', callback, 'callback');

		const correlationId = this._authenticate(call);

		(async () => {
			try {
				const response = await this._resourceDiscoveryService.deregister(correlationId, call.request.getName());

				const reply = new registryMessages.DeregisterResponse();
				reply.setSuccess(response.success);
				callback(null, reply);
			}
			catch (err) {
				this._logger.exception('LightweightResourceDiscoveryGrpcService', 'deregister', err, correlationId);
				callback(err, null);
			}
		})();
	}

	getService(call, callback) {
		this._enforceNotNull('LightweightResourceDiscoveryGrpcService', 'getService', call, 'call');
		this._enforceNotNull('LightweightResourceDiscoveryGrpcService', 'getService', callback, 'callback');

		const correlationId = this._authenticate(call);

		(async () => {
			try {
				const response = await this._resourceDiscoveryService.get(correlationId, call.request.getName());

				const reply = new registryMessages.GetResponse();
				reply.setSuccess(response.success);
				callback(null, reply);
			}
			catch (err) {
				this._logger.exception('LightweightResourceDiscoveryGrpcService', 'getService', err, correlationId);
				callback(err, null);
			}
		})();
	}

	register(call, callback) {
		this._enforceNotNull('LightweightResourceDiscoveryGrpcService', 'register', call, 'call');
		this._enforceNotNull('LightweightResourceDiscoveryGrpcService', 'register', callback, 'callback');

		const correlationId = this._authenticate(call);

		(async () => {
			try {
				const response = await this._resourceDiscoveryService.register(correlationId, call.request.toObject());

				const reply = new registryMessages.RegisterResponse();
				reply.setSuccess(response.success);
				callback(null, reply);
			}
			catch (err) {
				this._logger.exception('LightweightResourceDiscoveryGrpcService', 'register', err, correlationId);
				callback(err, null);
			}
		})();
	}
}

export default LightweightResourceDiscoveryGrpcService;
