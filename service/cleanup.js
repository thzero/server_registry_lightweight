import Service from '@thzero/library_server/service/index';

class CleanupService extends Service {
	constructor() {
		super();
	}

	async init(injector) {
		await super.init(injector);
	}

	async cleanup(correlationId) {
		return this._success(correlationId);
	}
}

export default CleanupService;
