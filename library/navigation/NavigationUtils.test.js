const {
  RouteCompareResult,
  compareRoute,
  generateRouteName,
  separateRouteName
} = require('./NavigationUtils')

test('a/b?c=1 === a/b?c=1', () => {
  expect(compareRoute('a/b', 'a/b')).toBe(RouteCompareResult.equal)
  expect(compareRoute('a/b?c=1', 'a/b?c=1')).toBe(RouteCompareResult.equal)
  expect(compareRoute('a/b?c=&d', 'a/b?c&d=')).toBe(RouteCompareResult.equal)
  expect(compareRoute(null, null)).toBe(RouteCompareResult.equal)
  expect(compareRoute(undefined, undefined)).toBe(RouteCompareResult.equal)

  expect(compareRoute('a/b?c=1&d=12', 'a/b?c=2&d=2&e=3')).toBe(RouteCompareResult.diff)
  expect(compareRoute('a/d?c=1&d=2', 'a/b?c=1&')).toBe(RouteCompareResult.diff)
  expect(compareRoute('a/b?c=1', 'a/b?c=1d')).toBe(RouteCompareResult.diff)
  expect(compareRoute('a/b?d=1', 'a/b?c=1')).toBe(RouteCompareResult.diff)
  expect(compareRoute(undefined, null)).toBe(RouteCompareResult.diff)

  expect(compareRoute('a/b', 'a/b?c=1')).toBe(RouteCompareResult.subset)
  expect(compareRoute('a/b?c=1', 'a/b?c=1&d=2')).toBe(RouteCompareResult.subset)
  expect(compareRoute('a/b?c=1', 'a/b?c=1&d=2')).toBe(RouteCompareResult.subset)

  expect(compareRoute('a/b?c=1&d=2', 'a/b?c=1')).toBe(RouteCompareResult.superset)
  expect(compareRoute('a/b?c=1&d=2', 'a/b?c=1&')).toBe(RouteCompareResult.superset)
})

test('a b -> a/b', () => {
  expect(generateRouteName('a', 'b')).toBe('a/b')
})

test('a/b -> {moduleName: a, sceneName: b}', () => {
  expect(separateRouteName('a/b')).toMatchObject({ moduleName: 'a', sceneName: 'b' })
  expect(separateRouteName('a/b?c=1')).toMatchObject({ moduleName: 'a', sceneName: 'b', params: { c: '1' } })
  expect(separateRouteName({ a: 1, b: 2 })).toMatchObject({})
  expect(separateRouteName(undefined)).toMatchObject({})
  expect(separateRouteName(null)).toMatchObject({})
  expect(separateRouteName(null)).toMatchObject({})
  expect(separateRouteName('')).toMatchObject({})
  expect(separateRouteName('a/b/c')).toMatchObject({})
})
