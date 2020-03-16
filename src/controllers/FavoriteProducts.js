const { Router } = require("express");
const request = require("request-promise");
const { map } = require("bluebird");
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
				return res.status(BAD_REQUEST).json({ error: "Estão faltando parametros na requisição" });
			}

			const client = await Client.findByPk(id);

			if (!client) {
				logger.error("FavoriteProducts#store failed due to internal server error");
				return res.status(INTERNAL_SERVER_ERROR).json({ error: "Não foi possível encontrar seu usuário, por favor, entre em contato com o nosso suporte" });
			}
			try {
				await request({
					url: `http://challenge-api.luizalabs.com/api/product/${productId}`,
					method: "GET",
					rejectUnauthorized: true,
					timeout: 60000
				});
			} catch (ex) {
				logger.error("FavoriteProducts#store failed due to product not found in external API");
				return res.status(INTERNAL_SERVER_ERROR).json({ error: "O produto que você está tentando marcar como favorito não existe, por favor, entre em contato com nosso suporte" });
			}

			if (await FavoriteProducts.findOne({
				where: {
					external_id: productId,
					client_id: id
				}
			})) {
				logger.error("FavoriteProducts#store failed due to user already have this product fav");
				return res.status(INTERNAL_SERVER_ERROR).json({ error: "Esse produto já foi marcado como favorito por você" });
			}

			await client.createFavoriteProduct({
				external_id: productId
			});

			return res.status(SUCCESS).json({ success: true });
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
				logger.error("FavoriteProducts#index failed due to client not found in database");
				return res.status(NOT_FOUND).json({ error: "Não foi possível encontrar o seu usuário, por favor, entre em contato com o nosso suporte" });
			}

			const products = await client.getFavoriteProducts();

			const newProducts = await map(products, async product => {
				const magazineProduct = JSON.parse(await request({
					url: `http://challenge-api.luizalabs.com/api/product/${product.external_id}`,
					method: "GET",
					rejectUnauthorized: true,
					timeout: 60000
				}));

				return {
					id: product.id,
					productId: product.external_id,
					image: magazineProduct.image,
					price: magazineProduct.price,
					brand: magazineProduct.brand,
					title: magazineProduct.title
				};
			});

			return res.status(SUCCESS).json(newProducts);
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}

	async destroy(req, res) {
		try {
			const { id, body: {
				productId
			} } = req;

			const client = await Client.findByPk(id);

			if (!client) {
				logger.error("FavoriteProduct#destroy failed due to client not found in database");
				return res.status(NOT_FOUND).json({ error: "Não foi possível deletar esse produto favorito, por favor, entre em contato com o nosso suporte" });
			}

			await FavoriteProducts.destroy({
				where: {
					client_id: id,
					external_id: productId
				}
			});

			return res.status(SUCCESS).json({ success: true });
		} catch (e) {
			logger.error(e.message || e);
			logger.error(__filename);
			return res.status(INTERNAL_SERVER_ERROR).json({ error: e.message });
		}
	}
};