'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripeWebhooksService = stripeWebhooksService;
exports.stripeSignatureValidationMiddleware = stripeSignatureValidationMiddleware;

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('feathers-stripe-webhooks:main');

function stripeWebhooksService(handlers) {
  debug('Creating feathers-stripe-webhooks service');

  return (0, _service2.default)(handlers);
}

function stripeSignatureValidationMiddleware(stripe, route, endpointSecret) {
  return function () {
    var app = this;
    var bodyParserRaw = _bodyParser2.default.raw({ type: '*/*' });

    app.post(route, bodyParserRaw, function (req, res, next) {
      var signature = req.headers['stripe-signature'];
      if (!signature) {
        res.status(400).end();
        return;
      }

      try {
        stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
        req.body = JSON.parse(req.body.toString('utf8'));
      } catch (err) {
        res.status(400).end();
        return;
      }

      next();
    });
  };
}