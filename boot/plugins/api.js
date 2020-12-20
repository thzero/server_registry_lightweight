import Constants from '../../constants';

import ApiBootPlugin from '@thzero/library_server/boot/plugins/api';

import registryRepository from '../../repository/registry';

import registryRoute from '../../routes/index';

import cleanupService from '../../service/cleanup';
import grpcResourceDiscoveryService from '../../service/grpc';
import resourceDiscoveryService from '../../service/discovery/resource';
import restCommunicationService from '@thzero/library_server_service_rest_axios';
import validationService from '../../service/validation/joi';
import versionService from '../../service/version';

class AppApiBootPlugin extends ApiBootPlugin {
	async _initRepositories() {
		await super._initRepositories();

		this._injectRepository(Constants.InjectorKeys.REPOSITORY_REGISTRY, new registryRepository());
	}

	async _initRoutes() {
		await super._initRoutes();

		this._initRoute(new registryRoute());
	}

	async _initServices() {
		await super._initServices();

		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY, new resourceDiscoveryService());
		this._injectService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_GRPC, new grpcResourceDiscoveryService());

		// this._injectService(Constants.InjectorKeys.SERVICE_GAMES, new gamesService());
		this._injectService(Constants.InjectorKeys.SERVICE_CLEANUP, new cleanupService());

		this._injectService(Constants.InjectorKeys.SERVICE_VALIDATION, new validationService());
	}

	_initServicesCommunicationRest() {
		return new restCommunicationService();
	}

	_initServicesVersion() {
		return new versionService();
	}
}

export default AppApiBootPlugin;
