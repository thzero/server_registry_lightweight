import AppApiBootPlugin from '../api';

import registryRoute from '../../../routes/fastify/index';

class FastifyAppApiBootPlugin extends AppApiBootPlugin {
	async _initRoutes() {
		await super._initRoutes();

		this._initRoute(new registryRoute());
	}
}

export default FastifyAppApiBootPlugin;
