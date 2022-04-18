import Constants from '../../constants';

import Utility from '@thzero/library_common/utility/index';

import BaseRoute from '@thzero/library_server_fastify/routes/index';

class RegistryRoute extends BaseRoute {
	constructor(prefix) {
		super(prefix ? prefix : '/registry');
	}

	async init(injector, app, config) {
		await super.init(injector, app, config);
		// router.serviceResourceDiscovery = injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
		this._inject(app, injector, Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY, Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
	}

	get id() {
		return 'registry';
	}

	_initializeRoutes(router) {
		router.delete(this._join('/:name'),
			async (request, reply) => {
				// const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].deregister(request.correlationId, request.params.name)).check(request);
				this._jsonResponse(reply, Utility.stringify(response));
			}
		);

		router.post(this._join('/listing'),
			async (request, reply) => {
				// const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].listing(request.correlationId, request.body)).check(request);
				this._jsonResponse(reply, Utility.stringify(response));
			}
		);

		router.post(this._join('/'),
			async (request, reply) => {
				// const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].register(request.correlationId, request.body)).check(request);
				this._jsonResponse(reply, Utility.stringify(response));
			}
		);

		router.get(this._join('/:name'),
			// eslint-disable-next-line
			async (request, reply) => {
				// const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].register(request.correlationId, request.params.name)).check(request);
				this._jsonResponse(reply, Utility.stringify(response));
			}
		);
	}
}

export default RegistryRoute;
