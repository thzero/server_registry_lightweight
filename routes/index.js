import koaBody from 'koa-body';

import Constants from '../constants';

import Utility from '@thzero/library_common/utility';

import BaseRoute from '@thzero/library_server/routes/index';

class RegistryRoute extends BaseRoute {
	constructor(prefix) {
		super(prefix ? prefix : '/api/registry');
	}

	_initializeRoutes(router) {
		router.delete('/:name',
			koaBody({
				text: false,
			}),
			async (ctx, next) => {
				const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await service.deregister(ctx.correlationId, ctx.params.name)).check(ctx);
				ctx.body = Utility.stringify(response);
			}
		);

		router.post('/listing',
			koaBody({
				text: false,
			}),
			async (ctx, next) => {
				const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await service.listing(ctx.correlationId, ctx.request.body)).check(ctx);
				ctx.body = Utility.stringify(response);
			}
		);

		router.post('/',
			koaBody({
				text: false,
			}),
			async (ctx, next) => {
				const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await service.register(ctx.correlationId, ctx.request.body)).check(ctx);
				ctx.body = Utility.stringify(response);
			}
		);

		router.get('/:name',
			// eslint-disable-next-line
			async (ctx, next) => {
				const service = this._injector.getService(Constants.InjectorKeys.SERVICE_RESOURCE_DISCOVERY);
				const response = (await service.get(ctx.correlationId, ctx.params.name)).check(ctx);
				ctx.body = Utility.stringify(response);
			}
		);
	}
}

export default RegistryRoute;
