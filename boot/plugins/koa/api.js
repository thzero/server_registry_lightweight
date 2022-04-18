import AppApiBootPlugin from '../api';

import registryRoute from '../../../routes/koa/index';

class KoaAppApiBootPlugin extends AppApiBootPlugin {
	async _initRoutes() {
		await super._initRoutes();

		this._initRoute(new registryRoute());
	}
}

export default KoaAppApiBootPlugin;
