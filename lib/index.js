'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = feathersStripeWebhooks;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('feathers-stripe-webhooks:main');

function feathersStripeWebhooks(handlers) {
  debug('Creating feathers-stripe-webhooks service');

  return (0, _service2.default)(handlers);
}
module.exports = exports['default'];