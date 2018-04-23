import Debug from 'debug';
import service from './service';

const debug = Debug('feathers-stripe-webhooks:main');

export default function feathersStripeWebhooks(handlers) {
  debug('Creating feathers-stripe-webhooks service');

  return service(handlers);
}
