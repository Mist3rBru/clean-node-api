class LoginRouter {
	route() {
		return {
			status: 400, 
		}
	}
}

describe('Login', () => {
	it('should return 400 when password is not provided', async () => {
		const sut = new LoginRouter()
		const httpRequest = {
			body: {
				email: 'any-email',
			},
		}

		const httpResponse = await sut.route()

		expect(httpResponse.status).toBe(400)
	})
})
