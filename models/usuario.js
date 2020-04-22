module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuario', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        usuario: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "12345"
        },
        nivelAcesso: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "operador"
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "ativo"
        },
        departamento: {
            type: DataTypes.STRING,
        }
    },
        {
            freezeTableName: true,
        }
    );

    Usuario.associate = (models) => {
    };

    return Usuario;
}