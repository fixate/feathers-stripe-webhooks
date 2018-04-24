import createService from '../src/service';
import sinon from 'sinon';

module.exports = function(test) {
  const handlers = {
    customer: {
      created() { return Promise.resolve('the result'); },
    },
  };

  sinon.spy(handlers.customer, 'created');

  test('Service', function*(t) {
    let service = createService(handlers);
    t.ok(service.create, 'returns service object with create');

    let result = yield service.create({ id: 'evt_123', type: 'customer.created', data: { object: { a:1 } } });
    t.ok(handlers.customer.created.called, 'Customer.created called');

    t.equals(result, 'the result', 'Returns the result of the handler');

    handlers.customer.created.reset();
    result = yield service.create({ type: 'customer.updated', data: { object: { a: 1 } }  });
    t.deepEquals(result, {}, 'Returns success on unhandled event types');

    service = createService(handlers);
    result = yield service.create({ type: 'customer.created', data: { object: { a: 1 } }  });

    t.ok(handlers.customer.created.called, 'Customer.created called');

    result = yield service
      .create({ id: 'evt_123', type: 'fake.created', data: { object: { a:1 } } })
      .catch(e => e);
    t.deepEquals(result , {}, 'Empty object (feathers returns 201) when called with unhandled event type');
  });
};
