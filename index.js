import Constants from './constants';

import ApiPlugin from './boot/plugins/api';

import BootMain from '@thzero/library_server/boot/main';

import usageMetricsRepository from '@thzero/library_server/repository/usageMetrics/devnull';

import appMetricsMonitoringService from '@thzero/library_server_monitoring_appmetrics';
import pinoLoggerService from '@thzero/library_server_logger_pino';
import mdnsDiscoveryService from '@thzero/library_server_service_discovery_mdns';
import winstonLoggerService from '@thzero/library_server_logger_winston';

class AppBootMain extends BootMain {
	_initRepositoriesUsageMetrics() {
		return new usageMetricsRepository();
	}

	_initServicesLoggers() {
		this._registerServicesLogger(Constants.InjectorKeys.SERVICE_LOGGER_PINO, new pinoLoggerService());
		this._registerServicesLogger(Constants.InjectorKeys.SERVICE_LOGGER_WISTON, new winstonLoggerService());
	}

	_initServicesDiscoveryMdns() {
		return new mdnsDiscoveryService();
	}

	_initServicesMonitoring() {
		return new appMetricsMonitoringService();
	}
}

(async function() {
	await (new AppBootMain()).start(ApiPlugin);
})();
