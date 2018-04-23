'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createService;

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('feathers-stripe-webhooks:service');

function getHandler(handlers, event) {
  var parts = event.type.split('.');
  var node = handlers;

  for (var p in parts) {
    node = node[parts[p]];

    if (!node) return null;
  }

  return node;
}

function createService(handlers) {
  return {
    setup: function setup(app) {
      this.app = app;
    },
    create: function create(event, params) {
      var handler = getHandler(handlers, event);

      if (!handler) {
        debug('Event type ' + event.type + ' is unhandled. Nothing to do.');
        return Promise.resolve({});
      }

      return handler({ object: event.data.object, event: event, params: params, app: this.app });
    }
  };
}
module.exports = exports['default'];