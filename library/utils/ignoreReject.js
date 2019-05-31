export default (promise) => {
  return promise.then((response) => response, () => {})
}