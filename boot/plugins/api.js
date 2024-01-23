import Constants from '../../constants.js';
import RepositoryConstants from '@thzero/library_server_repository_mongo/constants.js';

import ApiBootPlugin from '@thzero/library_server_fastify/boot/plugins/api.js';

import repositoryCollectionsService from '../../repository/mongo/collections.js';

// import registryRepository from '../../repository/inmemory/registry';
import registryRepository from '../../repository/redis/registry.js';
import registrySearchRepository from '../../repository/mongo/registry.js';

import cleanupService from '../../service/cleanup.js';
import devnullNotificationService from '../../service/notification/devnull.js';
import grpcResourceDiscoveryService from '../../service/discovery/resource/grpc/index.js';
import grpcHealthcheckResourceDiscoveryService from '../../service/discovery/resource/grpc/healthCheck.js';
import httpHealthcheckResourceDiscoveryService from '../../service/discovery/resource/http/healthCheck.js';
import healthcheckResourceDiscoveryService from '../../service/discovery/resource/healthCheck.js';
import loaderResourceDiscoveryService from '../../service/discovery/resource/loader.js';
import resourceDiscoveryService from '../../service/discovery/resource/index.js';
import registryService from '../../service/registry/index.js';
import restCommunicationService from '@thzero/library_server_service_rest_axios';
import validationService from '../../service/validation/joi/index.js';
import versionService from '../../service/version.js';

class AppApiBootPlugin extends ApiBootPlugin {
	async _initRepositories() {
		await super._initRepositories();

		this._injectRepository(Constants.InjectorKeys.REPOSITORY_REGISTRY, new registryRepository());
		this._injectRepository(Constants.InjectorKeys.REPOSITORY_REGISTRY_SEARCH, new registrySearchRepository());
	}

	async _initServices() {
		await super._initServices();

		this._injectService(RepositoryConstants.InjectorKeys.SERVICE_REPOSITORY_COLLECTIONS, new repositoryCollectionsService());

		this._injectService(Constants.InjectorKeys.SERVICE_REGISTRY, new registryService());

		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY, new resourceDiscoveryService());
		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_GRPC, new grpcResourceDiscoveryService());
		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_LOADER, new loaderResourceDiscoveryService());
		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK, new healthcheckResourceDiscoveryService());
		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK_GRPC, new grpcHealthcheckResourceDiscoveryService());
		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK_HTTP, new httpHealthcheckResourceDiscoveryService());

		// this._injectService(Constants.InjectorKeys.SERVICE_GAMES, new gamesService());
		this._injectService(Constants.InjectorKeys.SERVICE_CLEANUP, new cleanupService());

		this._injectService(Constants.InjectorKeys.SERVICE_NOTIFICATION, this._initServicesNotification());

		this._injectService(Constants.InjectorKeys.SERVICE_VALIDATION, new validationService());
	}

	_initServicesCommunicationRest() {
		return new restCommunicationService();
	}

	_initServicesNotification() {
		return new devnullNotificationService();
	}

	_initServicesVersion() {
		return new versionService();
	}
}

export default AppApiBootPlugin;
