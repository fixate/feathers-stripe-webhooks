import Debug from 'debug';
import errors from 'feathers-errors';

const debug = Debug('feathers-stripe-webhooks:service');

function fetchEvent(stripe, eventId) {
  return new Promise((resolve, reject) => {
    stripe.events.retrieve(eventId, (err, event) => {
      if (err) {
        return reject(err);
      }

      resolve(event);
    });
  });
}

function getHandler(handlers, data) {
  const parts = data.type.split('.');
  let node = handlers;
  parts.forEach((p) => {
    node = node[p];
    if (!node) {
      return null;
    }
  });

  return node;
}

export default function createService(stripe, handlers, options) {
  return {
    setup(app) {
      this.app = app;
    },

    create(data) {
      const handler = getHandler(handlers, data);
      const app = this.app;
      if (!handler) {
        debug(`Event type ${data.type} is unhandled. Nothing to do.`)
        return Promise.resolve({});
      }

      const eventData = options.verifyEvents ?
        fetchEvent(stripe, data.id) :
        Promise.resolve(data);

      return eventData
        .then(event => {
          // SECURITY: Check that the event types match the given (unverified) data to
          // ensure that the handler we are calling is not supplied by an attacker.
          if (event.type !== data.type) {
            debug('POSSIBLE ATTACK! Handler type from fetched stripe event is different from given event!');
            throw new errors.BadRequest("Invalid event");
          }

          return handler({ object: event.data.object, event, app });
        });
    },
  };
}
