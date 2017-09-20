import Debug from 'debug';
import stripe from 'stripe';

import service from './service';

const debug = Debug('feathers-stripe-webhooks:main');

function checkOpts(options) {
  if (options.verifyEvents && !options.secret) {
    throw new Error('Stripe secret key (options.secret) is required when verifyEvents is true.');
  }
}

export default function feathersStripeWebhooks(handlers, config = {}) {
  const options = Object.assign(
    {
      // Set to false to disable event fetching from Stripe
      // https://stripe.com/docs/webhooks#verifying-events
      verifyEvents: true,
    },
    config
  );

  debug(`Creating feathers-stripe-webhooks service with options: ${JSON.stringify(options)}`);

  checkOpts(options);

  const api = options.secret ? stripe(options.secret) : null;
  return service(api, handlers, options);
}
