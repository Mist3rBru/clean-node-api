class AuthUseCaseSpy { 
  async auth(email, password) {
    
  }
}

const makeSut = () => {
  return new AuthUseCaseSpy
}