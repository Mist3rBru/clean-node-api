const ExpressRouterAdapter = require('../adapters/ExpressRouterAdapter')
const LoginRouterCompositor = require('../compositors/LoginRouterCompositor')

module.exports = (router) => {
  router.post('/login', ExpressRouterAdapter.adapt(LoginRouterCompositor.compose()))
}