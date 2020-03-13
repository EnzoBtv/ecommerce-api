const { Model, DataTypes } = require("sequelize");

class FavoriteProducts extends Model {
	static init(connection) {
		super.init(
			{
				client_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: { model: "clients", key: "id" },
					onUpdate: "CASCADE",
					onDelete: "CASCADE"
				},
				external_id: {
					type: DataTypes.STRING,
					allowNull: false
				},
			},
			{
				sequelize: connection
			}
		);
	}

	static associate(models) {
		FavoriteProducts.belongsTo(models.Client, {
			foreignKey: "client_id",
			as: "client"
		});
	}
}

module.exports = FavoriteProducts;