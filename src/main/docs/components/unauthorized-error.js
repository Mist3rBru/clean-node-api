const unauthorizedErrorComponent = {
  description: 'Unauthorized',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}

module.exports = unauthorizedErrorComponent