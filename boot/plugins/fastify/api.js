import AppApiBootPlugin from '../api.js';

import registryRoute from '../../../routes/fastify/index.js';

class FastifyAppApiBootPlugin extends AppApiBootPlugin {
	async _initRoutes() {
		await super._initRoutes();

		this._initRoute(new registryRoute());
	}
}

export default FastifyAppApiBootPlugin;
