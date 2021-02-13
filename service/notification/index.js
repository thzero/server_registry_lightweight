import Service from '@thzero/library_server/service';

import NotImplementedError from '@thzero/library_common/errors/notImplemented';

class NotificationService extends Service {
	constructor() {
		super();
	}

	async init(injector) {
		await super.init(injector);
	}

	async send(correlationId, resource) {
		try {
			if (!resource)
				return this._success(correlationId);

			return this._send(correlationId, resource);
		}
		catch(err) {
			return this._error('NotificationService', 'notification', null, err, null, null, correlationId);
		}
	}

	async _send(correlationId, resource) {
		throw new NotImplementedError();
	}
}

export default NotificationService;
