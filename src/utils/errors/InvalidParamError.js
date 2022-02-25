module.exports = class InvalidParamError extends Error {
  constructor(param) {
    super(`Error: invalid param ${param}`)
    this.name = 'InvalidParamError'
  }
}