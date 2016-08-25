import createService from '../src/service';
import sinon from 'sinon';

module.exports = function(test) {
  const handlers = {
    customer: {
      created() { return 'the result'; },
    },
  };

  sinon.spy(handlers.customer, 'created');

  const stripeMock = {
    events: {
      retrieve(id, cb) {
        cb(null, {
          id,
          type: 'customer.created',
          data: { object: { mock: true } },
        });
      },
    },
  };

  sinon.spy(stripeMock.events, 'retrieve');

  test('Service', function*(t) {
    let service = createService(stripeMock, handlers, {});
    t.ok(service.create, 'returns service object with create');

    let result = yield service.create({ type: 'customer.created', data: { object: { a:1 } } });
    t.ok(handlers.customer.created.called, 'Customer.created called');
    t.deepEquals(handlers.customer.created.getCall(0).args[0], { a: 1 }, 'Passes object into handler')
    t.equals(result, 'the result', 'Returns the result of the handler');

    handlers.customer.created.reset();
    result = yield service.create({ type: 'customer.updated', data: { object: { a: 1 } }  });
    t.equals(typeof result, 'undefined', 'Ignores unhandled event types');

    service = createService(stripeMock, handlers, { verifyEvents: true });
    result = yield service.create({ type: 'customer.created', data: { object: { a: 1 } }  });

    t.ok(handlers.customer.created.called, 'Customer.created called');
    t.ok(stripeMock.events.retrieve.called, 'Stripe retrieve called');
  });
};
