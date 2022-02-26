class FindUserByEmailRepository { 
  async find(email) { 

  }
}

const makeSut = () => {
  const sut = new FindUserByEmailRepository()
  return { 
    sut
  }
}