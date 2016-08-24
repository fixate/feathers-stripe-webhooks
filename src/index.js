import Debug from 'debug';

const debug = Debug('feathers-stripe-webhooks:main');

function checkOpts(opts) {
}

export default function feathersStripeWebhooks(config) {
  const options = Object.assign({
  }, config);

  debug(`Creating feathers-stripe-webhooks service with options: ${JSON.stringify(options)}`);

  checkOpts(options);
  return createService(options);
}
