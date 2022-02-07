export default () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: window.location.href, reload: jest.fn() }
  })
}
