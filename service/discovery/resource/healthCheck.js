import Constants from '../../../constants';
import LibraryCommonServiceConstants from '@thzero/library_common_service/constants';

import LibraryUtility from '@thzero/library_common/utility/index';

import Service from '@thzero/library_server/service/index';

class HealthCheckLightweightResourceDiscoveryService extends Service {
	constructor() {
		super();

		this._repositoryRegistry = null;

		this._serviceMonitoring = null;
		this._serviceNotification = null;
		this._serviceResourceDiscovery = null;

		this._services = new Map();
	}

	async init(injector) {
		await super.init(injector);

		this._repositoryRegistry = this._injector.getService(Constants.InjectorKeys.REPOSITORY_REGISTRY);

		this._serviceMonitoring = this._injector.getService(LibraryCommonServiceConstants.InjectorKeys.SERVICE_MONITORING);
		this._serviceNotification = this._injector.getService(Constants.InjectorKeys.SERVICE_NOTIFICATION);
		this._serviceResourceDiscovery = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);

		this._services.set('grpc', this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK_GRPC));
		this._services.set('http', this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK_HTTP));
	}

	async initPost() {
		const healthCheckInterval = Number(this._config.get('registry.healthCheckInterval', 5000)) || 5000;
		setInterval((async function () {
			let correlationId = null;
			try {
				correlationId = LibraryUtility.generateId();
				await this._healthCheck(correlationId);
			}
			catch(err) {
				this._logger.exception('LightweightResourceDiscoveryService', '_initServer.healthCheckInterval', err, correlationId);
			}
		}).bind(this), healthCheckInterval);
	}

	async _healthCheck(correlationId) {
		try {
			this._logger.info2(`HEARTBEAT for HEALTHCHECK`, null, correlationId);
			const listResponse = await this._serviceResourceDiscovery.listing(correlationId, { healthCheck: true });
			if (!listResponse.success) {
				this._logger.info2(`\t...no resources.`, null, correlationId);
				return;
			}

			const promises = [];
			listResponse.results.forEach((resource) => this._healthCheckGeneratePromises(correlationId, resource, promises));
			await Promise.all(promises);
		}
		catch(err) {
			this._logger.exception('LightweightResourceDiscoveryService', '_healthCheck', err, correlationId);
		}
	}

	_healthCheckGeneratePromises(correlationId, resource, promises) {
		try {
			this._enforceNotNull('LightweightResourceDiscoveryService', '_healthCheckGeneratePromises', resource, 'resource', correlationId);
			this._enforceNotNull('LightweightResourceDiscoveryService', '_healthCheckGeneratePromises', promises, 'promises', correlationId);

			promises.push(new Promise((resolve, reject) => {
				try {
					(async () => {
						await this._healthCheckPerform(correlationId, resource);
						resolve();
					})();
				}
				catch(err) {
					reject(err);
				}
			}));
		}
		catch(err) {
			this._logger.exception('LightweightResourceDiscoveryService', '_healthCheckGeneratePromises', err, correlationId);
		}
	}

	async _healthCheckPerform(correlationId, resource) {
		try {
			this._enforceNotNull('LightweightResourceDiscoveryService', '_healthCheckPerform', resource, 'resource', correlationId);

			try {
				if (!resource.healthCheck)
					return this._success(correlationId);

				const enabled = resource.healthCheck.enabled !== undefined && resource.healthCheck.enabled !== null ? resource.healthCheck.enabled : true;
				this._logger.debug('LightweightResourceDiscoveryService', '_healthCheckPerform', 'enabled', enabled, correlationId);
				if (!enabled)
					return this._success(correlationId);

				this._logger.debug('LightweightResourceDiscoveryService', '_healthCheckPerform', 'healthCheck.type', resource.healthCheck.type, correlationId);
				const type = resource.healthCheck.type ? resource.healthCheck.type : 'http';
				this._logger.debug('LightweightResourceDiscoveryService', '_healthCheckPerform', 'type', type, correlationId);
				const service = this._services.get(type);
				if (!service)
					throw Error(`Invalid healthcheck '${type}' service.`);

				this._logger.info2(`\tHealthcheck for '${resource.name}' via '${type}'...`, null, correlationId);

				const response = await service.perform(correlationId, resource);
				resource.status = response.success ? 200 : 503;
				await this._repositoryRegistry.update(correlationId, resource.name, resource, response.success);

				this._logger.info2(`\t...healthcheck for '${resource.name}' ${response.success ? 'succeeded' : 'failed'}.`, null, correlationId);

				await this._serviceMonitoring.gauge(correlationId, 'discovery.registry.healthcheck', response.success ? 1 : 0, null, { tag: resource.name });

				if (!response.success)
					this._notification(correlationId, resource);

				return response;
			}
			catch(err) {
				this._logger.info2(`\t...healthcheck for '${resource.name}' failed.`, null, correlationId);
				this._logger.exception('LightweightResourceDiscoveryService', '_healthCheckPerform', err, correlationId);

				this._notification(correlationId, resource);
			}
		}
		catch(err) {
			this._logger.exception('LightweightResourceDiscoveryService', '_healthCheckPerform', err, correlationId);
		}
	}

	_notification(correlationId, resource) {
		(async () => {
			await this._serviceNotification.send(correlationId, resource);
		})();
	}
}

export default HealthCheckLightweightResourceDiscoveryService;
