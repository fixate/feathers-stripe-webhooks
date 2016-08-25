import test from 'tape-async';

test('Options', (t) => {
  t.end();
});

[
  './service',
].forEach((p) => {
  require(p)(test);
});
