import Constants from '../../constants';

import ServerBaseGrpcService from '@thzero/library_server_service_grpc/server';

const registryMessages = require('../../proto_registry/binary/registry_pb');
const registryServices = require('../../proto_registry/binary/registry_grpc_pb');

class GrpcService extends ServerBaseGrpcService {
	constructor() {
		super();

		this._grpc = null;

		this._serviceRegistry = null;
	}

	async _initServices(injector) {
		this._serviceRegistry = this._injector.getService(Constants.InjectorKeys.SERVICE_REGISTRY);

		this._grpc.addService(registryServices.RegistryService, {
			deregister: this.deregister.bind(this),
			get: this.get.bind(this),
			regoster: this.register.bind(this),
		});
	}

	deregister(call, callback) {
		this._enforceNotNull('GrpcService', 'deregister', call, 'call');
		this._enforceNotNull('GrpcService', 'deregister', callback, 'callback');

		//const correlationId = this._correlationId(call);
		const correlationId = call.request.getCorrelationid();
		this._authenticate(correlationId, call);

		(async () => {
			try {
				const response = await this._serviceRegistry.deregister(correlationId, call.request.getName());

				const reply = new registryMessages.DeregisterResponse();
				if (response.success)
					reply.setClientid(response.results.clientId);
				reply.setSuccess(response.success);
				callback(null, reply);
			}
			catch (err) {
				this._logger.exception('GrpcService', 'deregister', err, correlationId);
				callback(err, null);
			}
		})();
	}

	get(call, callback) {
		this._enforceNotNull('GrpcService', 'get', call, 'call');
		this._enforceNotNull('GrpcService', 'get', callback, 'callback');

		//const correlationId = this._correlationId(call);
		const correlationId = call.request.getCorrelationid();
		this._authenticate(correlationId, call);

		(async () => {
			try {
				const response = await this._serviceRegistry.get(correlationId, call.request.getName());

				const reply = new registryMessages.GetResponse();
				if (response.success)
					reply.setClientid(response.results.clientId);
				reply.setSuccess(response.success);
				callback(null, reply);
			}
			catch (err) {
				this._logger.exception('GrpcService', 'get', err, correlationId);
				callback(err, null);
			}
		})();
	}

	register(call, callback) {
		this._enforceNotNull('GrpcService', 'register', call, 'call');
		this._enforceNotNull('GrpcService', 'register', callback, 'callback');

		//const correlationId = this._correlationId(call);
		const correlationId = call.request.getCorrelationid();
		this._authenticate(correlationId, call);

		(async () => {
			try {
				const node = {
					name: nodecall.request.getName(),
					address: nodecall.request.getAddress(),
					port: nodecall.request.getPort(),
					healthCheck: nodecall.request.getHealtcheck(),
					secure: nodecall.request.getSecure(),
					grpc: {
						port: nodecall.request.getGrpc().getPort(),
						secure: nodecall.request.getGrpc().getSecure()
					}
				};

				const response = await this._serviceRegistry.register(correlationId, node);

				const reply = new registryMessages.RegisterResponse();
				if (response.success)
					reply.setClientid(response.results.clientId);
				reply.setSuccess(response.success);
				callback(null, reply);
			}
			catch (err) {
				this._logger.exception('GrpcService', 'register', err, correlationId);
				callback(err, null);
			}
		})();
	}
}

export default GrpcService;
