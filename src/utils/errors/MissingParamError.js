module.exports = class MissingParamError extends Error {
  constructor(param) {
    super(`Error: missing param ${param}`)
    this.name = 'MissingParamError'
  }
}