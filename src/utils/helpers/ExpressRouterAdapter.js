module.exports = class ExpressRouterAdapter {
	adapt(router) {
		return async (req, res) => {
			const httpRequest = { body: req.body }
			const httpResponse = await router.route(httpRequest)
			res.status(httpResponse.status).json(httpResponse.body)
		}
	}
}
