# feathers-stripe-webhooks

[![Build Status](https://travis-ci.org/fixate/feathers-stripe-webhooks.svg?branch=master)](https://travis-ci.org/fixate/feathers-stripe-webhooks)

## Installation

`npm install --save feathers-stripe-webhooks`


## Usage

```javascript
const webhooksService = require('feathers-stripe-webhooks');

const handlers = {
  customer: {
    // Handles customer.created event
    created({ object, event, app }) {
      // Handle webhook
      // NOTE: Whatever you return will be returned as a response to stripe.
      // If you return undefined feathers will 404 and the hook will fail
    },
    updated({ object, event, app }) {
      return new Promise(....); // Return promises
    }
  },
  invoice: {
    // Handles invoice.created event
    created() { /*...*/ },
  },
  //....
};

module.exports = function() {
  const app = this;
  const options = app.get('stripe').webhooks;
  app.use('/stripe/webhooks', webhooksService(handlers, options));
};
```

## Configuration

`secret` - Stripe api key (Required if `verifyEvents` is `true`)

`verifyEvents` -Fetch events from stripe https://stripe.com/docs/webhooks#verifying-events (default: `true`)

## Protecting the endpoint (HTTPS assumed)

Stripe recommends using a secret key in the webhook url so that you can
be sure that the request is coming from stripe. e.g https://stripe:longrandomsecret@mydomain.com/stripe/webhooks

This is out of the scope of this library as it can be implemented by
creating a middleware for your service endpoint.

```javascript
const basicAuth = require('basic-auth');

function checkBasicAuth(username, password) {
  return function handler(req, res, next) {
    const credentials = basicAuth(req);
    if (!credentials || credentials.name !== username || credentials.pass !== password) {
      res.statusCode = 401
      res.setHeader('WWW-Authenticate', 'Basic realm=myRealm');
      res.end('Access Denied');
    } else {
      next();
    }
  };
}

app.use('/stripe/webhook', checkBasicAuth('stripe', yourWebhookSecret), webhooksService(...));
```


