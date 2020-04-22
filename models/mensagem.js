module.exports = (sequelize, DataTypes) => {
    const Mensagem = sequelize.define('mensagem', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        texto: {
          type: DataTypes.TEXT,
          allowNull: false
        },
      },
      {
        freezeTableName: true,
      }
    );
  
    Mensagem.associate = (models) => {
    };
  
    return Mensagem;
  }