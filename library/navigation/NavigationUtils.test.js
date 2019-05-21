const {
  RouteCompareResult,
  compareRoute
} = require('./NavigationUtils')

test('a/b?c=1 === a/b?c=1', () => {
  expect(compareRoute('a/b?c=1', 'a/b?c=1')).toBe(RouteCompareResult.equal);
  expect(compareRoute('a/b?c=&d', 'a/b?c&d=')).toBe(RouteCompareResult.equal);
  expect(compareRoute(null, null)).toBe(RouteCompareResult.equal);
  expect(compareRoute(undefined, undefined)).toBe(RouteCompareResult.equal);

  expect(compareRoute('a/b?c=1', 'a/b?c=1d')).toBe(RouteCompareResult.diff);
  expect(compareRoute('a/b?d=1', 'a/b?c=1')).toBe(RouteCompareResult.diff);
  expect(compareRoute(undefined, null)).toBe(RouteCompareResult.diff);

  expect(compareRoute('a/b', 'a/b?c=1')).toBe(RouteCompareResult.subset);
  expect(compareRoute('a/b?c=1', 'a/b?c=1&d=2')).toBe(RouteCompareResult.subset);
  expect(compareRoute('a/b?c=1', 'a/b?c=1&d=2')).toBe(RouteCompareResult.subset);

  expect(compareRoute('a/b?c=1&d=2', 'a/b?c=1')).toBe(RouteCompareResult.superset);
  expect(compareRoute('a/b?c=1&d=2', 'a/b?c=1&')).toBe(RouteCompareResult.superset);
});