# feathers-stripe-webhooks

[![Build Status](https://travis-ci.org/fixate/feathers-stripe-webhooks.svg?branch=master)](https://travis-ci.org/fixate/feathers-stripe-webhooks)

## Installation

`npm install --save feathers-stripe-webhooks`


## Usage

```javascript
// default.json
{
  "stripe": {
    "apiKey": "sk_test_MP5bNSfgUyBG2cq3bCntjfLm",
    "webhooks": {
      "signature": {
        "verify": true,
        "secret": "whsec_sZYN4b3x00PWFvTejfY5xudYx4D8TvW9"
      }
    }
  }
}
```

```javascript
// app.js
const stripe = require('stripe')(config.stripe.apiKey);
const { stripeSignatureValidationMiddleware } = require('feathers-stripe-webhooks');

if (config.stripe.webhooks.signature.verify)
  app.configure(stripeSignatureValidationMiddleware(stripe, '/stripe/webhooks', config.stripe.webhooks.signature.secret));

// run other body-parser rules here, i.e. app.use(bodyParser.json())
```

```javascript
// stripe-webhooks.service.js
const { stripeWebhooksService } = require('feathers-stripe-webhooks');
const handlers = require('./stripe-webhooks.handlers');
const hooks = require('./stripe-webhooks.hooks');

module.exports = function (app) {
  app.use('/stripe/webhooks', stripeWebhooksService(handlers));

  const service = app.service('stripe/webhooks');

  service.hooks(hooks);
};
```

```javascript
// stripe-webhooks.handlers.js
module.exports = {
  customer: {
    // Handles customer.created event
    async created({ object, event, params, app }) {
      // Handle webhook
      // NOTE: Whatever you return will be returned as a response to stripe.
      // If you return undefined feathers will 404 and the hook will fail
      
      params.doSomething = true;
      
      return {};
    },
    async updated({ object, event, params, app }) {
      return {};
    },
    subscription: {
      async created({ object, event, params, app }) {
        return {};
      },
    },
  },
  invoice: {
    // Handles invoice.created event
    async created() { /*...*/ },
  },
  //....
};
```

```javascript
// stripe-webhooks.hooks.js
module.exports = {
  after: {
    create: [
      iff(hook => hook.params.doSomething,
        doSomething()
      ),
    ],
  },
};
```
