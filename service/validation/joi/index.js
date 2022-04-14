import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
Joi.extend(JoiDate);

import JoiBaseValidationService from '@thzero/library_server_validation_joi/index';

class JoiValidationService extends JoiBaseValidationService {
	_address = Joi.string()
		.trim()
		//.alphanum()
		.regex(/^([._\-a-zA-Z0-9]*)*$/)
		.min(3)
		.max(30);
	_apiKey = Joi.string()
		.trim()
		//.alphanum()
		.regex(/^([_\-a-zA-Z0-9]*)*$/)
		.min(3)
		.max(36);
	_healthCheck = Joi.string()
		.trim()
		//.alphanum()
		.regex(/^([._\-a-zA-Z0-9]*)*$/)
		.min(3)
		.max(30);
	_label = Joi.string()
		.trim()
		//.alphanum()
		.regex(/^([_\-a-zA-Z0-9]*)*$/)
		.min(3)
		.max(30);
	_namespace = Joi.string()
		.trim()
		//.alphanum()
		.regex(/^([_\-a-zA-Z0-9]*)*$/)
		.min(2)
		.max(30);
	_notes = Joi.string()
		.trim()
		//.alphanum()
		.regex(/^([._\-a-zA-Z0-9 ]*)*$/);
	_port = Joi.number()
		.min(1024)
		.max(49151);
	_secure = Joi.boolean();
	_static = Joi.boolean();
	_ttl = Joi.number();
	_type = Joi.string()
		.trim()
		//.alphanum()
		.regex(/^([a-zA-Z]*)*$/)
		.min(3)
		.max(30);

	registeryNameSchema = this._label.required();

	authenticationSchema = Joi.object({
		apiKey: this._apiKey.allow(null).allow('')
	});

	dnsSchema = Joi.object({
		label: this._label.required(),
		namespace: this._namespace.allow(null).allow(''),
		local: Joi.boolean().allow(null)
	});

	grpcSchema = Joi.object({
		enabled: Joi.boolean().allow(null),
		port: this._port.allow(null),
		secure: this._secure.allow(null)
	});

	healthCheckSchema = Joi.object({
		enabled: Joi.boolean().allow(null),
		healthCheck: this._healthCheck.allow(null).allow(''),
		interval: Joi.number(),
		type: this._type.allow(null).allow('')
	});

	registeryRegisterSchema = Joi.object({
		name: this._name.required(),
		address: this._address.required().allow(null).allow(''),
		port: this._port.allow(null),
		healthCheck: this.healthCheckSchema.allow(null),
		healthcheck: this.healthCheckSchema.allow(null),
		notes: this._notes.allow(null).allow(''),
		secure: this._secure.allow(null),
		static: this._static.allow(null),
		ttl: this._ttl.allow(null),
		grpc: this.grpcSchema.allow(null),
		dns: this.dnsSchema.allow(null),
		authentication: this.authenticationSchema.allow(null)
	});
}

export default JoiValidationService;
