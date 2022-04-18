import Constants from '../../constants';
import RepositoryConstants from '@thzero/library_server_repository_mongo/constants';

// import ApiBootPlugin from '@thzero/library_server_fastify/boot/plugins/api';
import ApiBootPlugin from '@thzero/library_server_koa/boot/plugins/api';

import repositoryCollectionsService from '../../repository/mongo/collections';

// import registryRepository from '../../repository/inmemory/registry';
import registryRepository from '../../repository/redis/registry';
import registrySearchRepository from '../../repository/mongo/registry';

import cleanupService from '../../service/cleanup';
import devnullNotificationService from '../../service/notification/devnull';
import grpcResourceDiscoveryService from '../../service/discovery/resource/grpc';
import grpcHealthcheckResourceDiscoveryService from '../../service/discovery/resource/grpc/healthCheck';
import httpHealthcheckResourceDiscoveryService from '../../service/discovery/resource/http/healthCheck';
import healthcheckResourceDiscoveryService from '../../service/discovery/resource/healthCheck';
import loaderResourceDiscoveryService from '../../service/discovery/resource/loader';
import resourceDiscoveryService from '../../service/discovery/resource';
import restCommunicationService from '@thzero/library_server_service_rest_axios';
import validationService from '../../service/validation/joi';
import versionService from '../../service/version';

class AppApiBootPlugin extends ApiBootPlugin {
	async _initRepositories() {
		await super._initRepositories();

		this._injectRepository(Constants.InjectorKeys.REPOSITORY_REGISTRY, new registryRepository());
		this._injectRepository(Constants.InjectorKeys.REPOSITORY_REGISTRY_SEARCH, new registrySearchRepository());
	}

	async _initServices() {
		await super._initServices();

		this._injectService(RepositoryConstants.InjectorKeys.SERVICE_REPOSITORY_COLLECTIONS, new repositoryCollectionsService());

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
