import NotificationService from './index.js';

class DevNullNotificationService extends NotificationService {
	constructor() {
		super();
	}

	async init(injector) {
		await super.init(injector);
	}

	async _send(correlationId, resource) {
	}
}

export default DevNullNotificationService;
