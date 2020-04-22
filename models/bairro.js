module.exports = (sequelize, DataTypes) => {
    const Bairro = sequelize.define('bairro', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
        {
            freezeTableName: true,
        }
    );

    Bairro.associate = (models) => {
    };

    return Bairro;
}