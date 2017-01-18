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
    let service = createService(stripeMock, handlers, {
      verifyEvents: true,
    });
    t.ok(service.create, 'returns service object with create');

    let result = yield service.create({ id: 'evt_123', type: 'customer.created', data: { object: { a:1 } } });
    t.ok(handlers.customer.created.called, 'Customer.created called');

    t.ok(stripeMock.events.retrieve.called, 'Retrieves event');
    t.equals(
      stripeMock.events.retrieve.getCall(0).args[0],
      'evt_123',
      'Calls stripe event retrieve with event id'
    );

    t.deepEquals(
      handlers.customer.created.getCall(0).args[0].object,
      { mock: true },
      'Passes verified object into handler'
    )
    t.equals(result, 'the result', 'Returns the result of the handler');

    handlers.customer.created.reset();
    result = yield service.create({ type: 'customer.updated', data: { object: { a: 1 } }  });
    t.deepEquals(result, {}, 'Returns success on unhandled event types');

    service = createService(stripeMock, handlers, { verifyEvents: true });
    result = yield service.create({ type: 'customer.created', data: { object: { a: 1 } }  });

    t.ok(handlers.customer.created.called, 'Customer.created called');
    t.ok(stripeMock.events.retrieve.called, 'Stripe retrieve called');

    result = yield service
      .create({ id: 'evt_123', type: 'fake.created', data: { object: { a:1 } } })
      .catch(e => e);
    t.deepEquals(result , {}, 'Empty object (feathers returns 201) when called with unhandled event type');
  });
};
