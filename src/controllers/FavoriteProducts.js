const { Router } = require("express");

const Client = require("../database/models/Client");
const FavoriteProducts = require("../database/models/FavoriteProducts");

const { SUCCESS, INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND } = require("../constants/HttpStatus");

const logger = require("../util/logger");
const privateRoute = require("../middlewares/Auth");
module.exports = class FavoriteProductsController {
	constructor() {
		this.router = Router();
		this.path = "/product/favorite";
		this.init();
	}

	init() {
		this.router.post(this.path, privateRoute, this.store);
		this.router.get(this.path, privateRoute, this.index);
		this.router.delete(this.path, privateRoute, this.destroy);
	}

	async store(req, res) {
		try {
			const { id, body: { productId } } = req;

			if (!productId) {
				logger.error("FavoriteProducts#store failed due to missing parameters");
				res.status(BAD_REQUEST).json({ error: "Estão faltando parametros na requisição" });
			}

			const client = await Client.findByPk(id);

			if (!client) {
				logger.error("FavoriteProducts#store failed due to internal server error");
				res.status(INTERNAL_SERVER_ERROR).json({ error: "Não foi possível realizar a criação de usuário, por favor, entre em contato com o nosso suporte" });
			}

			client.addfavoriteProducts(await FavoriteProducts.create({

			}));

			res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}

	}

	async index(req, res) {
		try {
			const { id } = req;

			const client = await Client.findByPk(id);

			if (!client) {
				logger.error("Client#index failed due to client not found in database");
				res.status(NOT_FOUND).json({ error: "Não foi possível encontrar o seu usuário, por favor, entre em contato com o nosso suporte" });
			}

			res.status(SUCCESS).json(client.toJSON());
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}

	async destroy(req, res) {
		try {
			const { id } = req;

			const client = await Client.destroy({
				where: {
					id
				}
			});

			if (!client) {
				logger.error("Client#destroy failed due to client not found in database");
				res.status(NOT_FOUND).json({ error: "Não foi possível deletar seu usuário, por favor, entre em contato com o nosso suporte" });
			}

			res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}
};