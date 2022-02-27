const { adapt } = require('../adapters/ExpressRouterAdapter')
const LoginRouterComposer = require('../composers/LoginRouterComposer')

module.exports = router => {
  router.post('/login', adapt(LoginRouterComposer.compose()))
}