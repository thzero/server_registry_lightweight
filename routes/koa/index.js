// eslint-disable-next-line node/no-extraneous-import
import koaBody from 'koa-body';

import Constants from '../../constants';

import Utility from '@thzero/library_common/utility/index';

import BaseRoute from '@thzero/library_server_koa/routes/index';

class RegistryRoute extends BaseRoute {
	constructor(prefix) {
		super(prefix ? prefix : '/registry');
	}

	async init(injector, app, config) {
		const router = await super.init(injector, app, config);
		router.serviceResourceDiscovery = injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
	}

	get id() {
		return 'registry';
	}

	_initializeRoutes(router) {
		router.delete('/:name',
			koaBody({
				text: false,
			}),
			async (ctx, next) => {
				// const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				// const response = (await ctx..deregister(ctx.correlationId, ctx.params.name)).check(ctx);
				const response = (await ctx.router.serviceResourceDiscovery.deregister(ctx.correlationId, ctx.params.name)).check(ctx);
				this._jsonResponse(ctx, Utility.stringify(response));
			}
		);

		router.post('/listing',
			koaBody({
				text: false,
			}),
			async (ctx, next) => {
				// const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				// const response = (await service.listing(ctx.correlationId, ctx.request.body)).check(ctx);
				const response = (await ctx.router.serviceResourceDiscovery.listing(ctx.correlationId, ctx.request.body)).check(ctx);
				this._jsonResponse(ctx, Utility.stringify(response));
			}
		);

		router.post('/',
			koaBody({
				text: false,
			}),
			async (ctx, next) => {
				const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await service.register(ctx.correlationId, ctx.request.body)).check(ctx);
				this._jsonResponse(ctx, Utility.stringify(response));
			}
		);

		router.get('/:name',
			// eslint-disable-next-line
			async (ctx, next) => {
				const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await service.get(ctx.correlationId, ctx.params.name)).check(ctx);
				this._jsonResponse(ctx, Utility.stringify(response));
			}
		);
	}
}

export default RegistryRoute;
