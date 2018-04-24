import bodyParser from 'body-parser';
import Debug from 'debug';
import service from './service';

const debug = Debug('feathers-stripe-webhooks:main');

export function stripeWebhooksService(handlers) {
  debug('Creating feathers-stripe-webhooks service');

  return service(handlers);
}

export function stripeSignatureValidationMiddleware(stripe, route, endpointSecret) {
  return function () {
    const app = this;
    const bodyParserRaw = bodyParser.raw({ type: '*/*' });

    app.post(route, bodyParserRaw, (req, res, next) => {
      const signature = req.headers['stripe-signature'];
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
  }
}
