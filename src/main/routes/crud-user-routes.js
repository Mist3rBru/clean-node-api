const { adapt } = require('../adapters/ExpressRouterAdapter')
const RegisterUserComposer = require('../composers/RegisterUserRouterComposer')

module.exports = router => {
  router.post('/user', adapt(RegisterUserComposer.compose()))
}