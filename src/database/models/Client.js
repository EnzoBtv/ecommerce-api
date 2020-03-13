const { Model, DataTypes } = require("sequelize");

class Client extends Model {
	static init(connection) {
		super.init(
			{
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
				}
			},
			{
				sequelize: connection
			}
		);
	}

	static associate(models) {
		Client.hasMany(models.FavoriteProducts, {
			foreignKey: "client_id",
			as: "favoriteProducts"
		});
	}
}

module.exports = Client;