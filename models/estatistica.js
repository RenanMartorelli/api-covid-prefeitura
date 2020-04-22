module.exports = (sequelize, DataTypes, models) => {
    const Estatistica = sequelize.define('estatistica', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipoContagem: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dataContagem: {
            type: DataTypes.DATE,
            allowNull: false
        },
        idUsuario: {
          type: DataTypes.INTEGER,
          references: {
            model: sequelize.Usuario,
            key: 'id',
          }
        },
        idBairro: {
          type: DataTypes.INTEGER,
          references: {
            model: sequelize.Bairro,
            key: 'id',
          }
        }
      },
      {
        freezeTableName: true,
        paranoid: true,
      }
    );
  
    Estatistica.associate = (models) => {
      Estatistica.belongsTo(models.bairro, {
        foreignKey: 'idBairro'
      })
      Estatistica.belongsTo(models.usuario, { 
        foreignKey: 'idUsuario'
      })
    };
  
    return Estatistica;
  }