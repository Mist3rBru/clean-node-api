const paths = require('./paths') 
const schemas = require('./schemas') 
const components = require('./components') 

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'CLEAN-NODE-API',
    description: 'Mangos\'s course API to sign up and login users',
    version: '1.0.0'
  },
  servers: [{
    url: '/api',
    description: 'Main Server'
  }],
  paths,
  schemas,
  components
}
