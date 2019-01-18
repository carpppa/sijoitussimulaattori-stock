import { ensureNecessaryEnvs, getOrThrow } from '../general';

test('ensureNecessaryEnvs should throw if specified environment variable is not set', () => {
  expect(() => ensureNecessaryEnvs(['FOO'])).toThrow();
});

test('getOrThrow should return object property or throw', () => {
  const foo = { bar: 5 };

  expect(getOrThrow<typeof foo.bar>('bar', foo)).toEqual(foo.bar);
  expect(() => getOrThrow<typeof foo.bar>('baz', foo)).toThrow();
});
