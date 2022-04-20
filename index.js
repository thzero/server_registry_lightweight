import Constants from './constants';

import LibraryUtility from '@thzero/library_common/utility/index';

import ApiPlugin from './boot/plugins/koa/api';

import BootMain from '@thzero/library_server_koa/boot';

import usageMetricsRepository from '@thzero/library_server/repository/usageMetrics/devnull';

// import appMetricsMonitoringService from '@thzero/library_server_monitoring_appmetrics';
import pinoLoggerService from '@thzero/library_server_logger_pino';
import mdnsDiscoveryService from '@thzero/library_server_service_discovery_mdns';
import winstonLoggerService from '@thzero/library_server_logger_winston';

class AppBootMain extends BootMain {
	_initRepositoriesUsageMetrics() {
		return new usageMetricsRepository();
	}

	async _initServer() {
		const serviceResourceDiscoverLoader = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY_LOADER);
		if (!serviceResourceDiscoverLoader)
			return;

		await serviceResourceDiscoverLoader.load(LibraryUtility.generateId());
	}

	_initServicesLoggers() {
		this._registerServicesLogger(Constants.InjectorKeys.SERVICE_LOGGER_PINO, new pinoLoggerService());
		this._registerServicesLogger(Constants.InjectorKeys.SERVICE_LOGGER_WISTON, new winstonLoggerService());
	}

	_initServicesDiscoveryMdns() {
		return new mdnsDiscoveryService();
	}

	// _initServicesMonitoring() {
	// 	return new appMetricsMonitoringService();
	// }
}

(async function () {
	await (new AppBootMain()).start(ApiPlugin);
})();
