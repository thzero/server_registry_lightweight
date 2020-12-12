import Joi from '@hapi/joi';
import JoiDate from '@hapi/joi-date';
Joi.extend(JoiDate);

import JoiBaseValidationService from '@thzero/library_server_validation_joi';

class JoiValidationService extends JoiBaseValidationService {
    _address = Joi.string()
        .trim()
        //.alphanum()
        .regex(/^([._\-a-zA-Z0-9]*)*$/)
        .min(3)
        .max(30);
    _healthCheck = Joi.string()
        .trim()
        //.alphanum()
        .regex(/^([._\-a-zA-Z0-9]*)*$/)
        .min(3)
        .max(30);
    _notes = Joi.string()
        .trim()
        //.alphanum()
        .regex(/^([._\-a-zA-Z0-9 ]*)*$/);
    _port = Joi.number()
        .min(1024)
        .max(49151);
    _secure = Joi.boolean();
    _ttl = Joi.number();

    registeryNameSchema = this._id.required();

	grpcSchema = Joi.object({
        port: this._port.allow(null),
        secure: this._secure.allow(null),
    });

	registeryRegisterSchema = Joi.object({
        name: this._name.required(),
        address: this._address.required(),
        port: this._port.allow(null),
        healthCheck: this._healthCheck.allow(null).allow(''),
        healthcheck: this._healthCheck.allow(null).allow(''),
        notes: this._notes.allow(null).allow(''),
        secure: this._secure.allow(null),
        ttl: this._ttl.allow(null),
        grpc: this.grpcSchema.allow(null)
    });
}

export default JoiValidationService;
