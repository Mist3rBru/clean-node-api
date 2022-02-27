const ExpressRouterAdapter = require('../adapters/ExpressRouterAdapter')
const LoginRouterComposer = require('../composers/LoginRouterComposer')

module.exports = (router) => {
  router.post('/login', ExpressRouterAdapter.adapt(LoginRouterComposer.compose()))
}