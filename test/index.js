import test from 'tape-async';
import feathersSendwithus from '../src';

test('Options', (t) => {
  t.throws(() => feathersSendwithus({}), Error, 'Requires the apiKey option to be set');
  t.doesNotThrow(() => feathersSendwithus({ apiKey: 'blah' }), 'Does not throw with correct options');
  t.end();
});

[
  './service',
].forEach((p) => {
  require(p)(test);
});
