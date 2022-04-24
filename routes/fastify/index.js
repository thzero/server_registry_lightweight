import Constants from '../../constants';

import BaseRoute from '@thzero/library_server_fastify/routes/index';

class RegistryRoute extends BaseRoute {
	constructor(prefix) {
		super(prefix ? prefix : '/registry');
	}

	async init(injector, app, config) {
		await super.init(injector, app, config);
		this._inject(app, injector, Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY, Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
	}

	get id() {
		return 'registry';
	}

	_initializeRoutes(router) {
		router.delete(this._join('/:name'),
			// eslint-disable-next-line
			async (request, reply) => {
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].deregister(request.correlationId, request.params.name)).check(request);
				this._jsonResponse(reply, response);
			}
		);

		router.post(this._join('/listing'),
			// eslint-disable-next-line
			async (request, reply) => {
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].listing(request.correlationId, request.body)).check(request);
				this._jsonResponse(reply, response);
			}
		);

		router.post(this._join('/'),
			// eslint-disable-next-line
			async (request, reply) => {
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].register(request.correlationId, request.body)).check(request);
				this._jsonResponse(reply, response);
			}
		);

		router.get(this._join('/:name'),
			// eslint-disable-next-line
			async (request, reply) => {
				const response = (await router[Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY].register(request.correlationId, request.params.name)).check(request);
				this._jsonResponse(reply, response);
			}
		);
	}
}

export default RegistryRoute;
