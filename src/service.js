import Debug from 'debug';

const debug = Debug('feathers-stripe-webhooks:service');

function getHandler(handlers, event) {
  const parts = event.type.split('.');
  let node = handlers;

  for (let p in parts) {
    node = node[parts[p]];

    if (!node)
      return null;
  }

  return node;
}

export default function createService(handlers) {
  return {
    setup(app) {
      this.app = app;
    },

    create(event, params) {
      const handler = getHandler(handlers, event);

      if (!handler) {
        debug(`Event type ${event.type} is unhandled. Nothing to do.`);
        return Promise.resolve({});
      }

      return handler({ object: event.data.object, event, params, app: this.app });
    },
  };
}
