import createService from '../src/service';
import sinon from 'sinon';

module.exports = function(test) {
  const api = { send(data, cb) { cb(null, data); } };

  sinon.spy(api, 'send');

  const templateMapper = (t) => Promise.resolve(`${t}'`);
  const service = createService({ api, templateMapper });

  test("Service", function*(t) {
    const data = {
      template: 'theId',
      recipient: { address: 'recipient@email.com' },
      sender: { address: 'sender@email.com' },
    };

    const result = yield service.create(data);

    t.deepEqual(result, {
      recipient: { address: 'recipient@email.com'  },
      sender: { address: 'sender@email.com'  },
      template: 'theId\''
    });

    t.ok(api.send.called, 'Api Send called');
    t.deepEquals(api.send.getCall(0).args[0].recipient, data.recipient, 'Calls with data');
    t.deepEquals(api.send.getCall(0).args[0].template, 'theId\'', 'Calls with mapped template');
  });
};
