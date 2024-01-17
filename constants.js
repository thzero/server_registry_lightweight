const Constants = {
	InjectorKeys: {
		REPOSITORY_REGISTRY: 'repositoryRegistry',
		REPOSITORY_REGISTRY_SEARCH: 'repositoryRegistrySearch',

		SERVICE_CLEANUP: 'serviceCleanup',

		SERVICE_LOGGER_PINO: 'serviceLoggerPino',
		SERVICE_LOGGER_WISTON: 'serviceLoggerWinston',

		SERVICE_NOTIFICATION: 'serviceNotifiation',

		SERVICE_REGISTRY: 'serviceRegistry',

		SERVICE_RESOURCE_DISCOVERY: 'serviceResourceDiscovery',
		SERVICE_RESOURCE_DISCOVERY_GRPC: 'serviceResourceDiscoveryGrpc',
		SERVICE_RESOURCE_DISCOVERY_LOADER: 'serviceResourceDiscoveryLoader',

		SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK: 'serviceResourceDiscoveryHealthcheck',
		SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK_GRPC: 'serviceResourceDiscoveryHealthcheckGrpc',
		SERVICE_RESOURCE_DISCOVERY_HEALTHCHECK_HTTP: 'serviceResourceDiscoveryHealthcheckHttp',

		SERVICE_VALIDATION: 'serviceValidation'
	}
}

export default Constants;
