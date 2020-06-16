require('express-group-routes');
var moment = require('moment');

module.exports = (app, db) => {

  app.get( "/estatistica", (req, res) =>
  db.estatistica.findAll({
      order: [
        ['dataContagem','ASC']
      ],
      include: [ {
        model: db.usuario,
        attributes: ['id','nome']
      },
      {
        model: db.bairro,
        attributes: ['id','nome']
       }
     ]
    }).then( (result) => res.json(result) )
);

app.get( "/estatistica-bairro", async (req, res) => {
  var response = []
  const resultDadosBairros = await db.estatistica.findAll({
    attributes: [
      'idBairro',
      'tipoContagem',
      [db.sequelize.fn('sum', db.sequelize.col('quantidade')), 'quantidade'],
      [db.sequelize.fn("max", db.sequelize.col('estatistica.updatedAt')), 'atualizadoEm']
    ],
    group : ['idBairro','tipoContagem'],
    raw: true,
    include: [{
        model: db.bairro,
        attributes: ['nome']
       }]
  })

  const resultBairros = await db.bairro.findAll({
    attributes: ['id','nome']
  })

  resultBairros.forEach(bairro => {
    response.push({
      idBairro: bairro.id,
      nomeBairro: bairro.nome,
      obitos: 0,
      confirmados: 0,
      suspeitos: 0,
      recuperados: 0,
      atualizadoEm: '2000-01-01',
    })
  });

  resultDadosBairros.forEach(dadoBairro => {
    let index = response.findIndex(bairro => bairro.idBairro === dadoBairro.idBairro);
    let tipoContagem = dadoBairro.tipoContagem
    response[index][tipoContagem] = dadoBairro.quantidade;
    // verifica qual a data mais recente de atualização.
    dadoBairro.atualizadoEm = moment(dadoBairro.atualizadoEm).format('YYYY-MM-DD')
    response[index].atualizadoEm = moment(response[index].atualizadoEm).isAfter(dadoBairro.atualizadoEm, 'day') ? response[index].atualizadoEm : dadoBairro.atualizadoEm;
  })
res.json(response) 
});

  app.group("/admin", (app) => {
  
    app.get( "/estatistica/:id", (req, res) =>
      db.estatistica.findByPk(req.params.id).then( (result) => res.json(result))
    );
  
    app.post("/estatistica", (req, res) => {
    const dataFormatada = moment(req.body.dataContagem,'DD/MM/YYYY').format('YYYY-MM-DD');
      db.estatistica.create({
        quantidade:    req.body.quantidade,
        tipoContagem:  req.body.tipoContagem,
        dataContagem:  dataFormatada,
        idBairro:      req.body.idBairro,
        idUsuario:     req.body.idUsuario
      }).then( (result) => res.json(result) )
    }
    );
  
    app.put( "/estatistica/:id", (req, res) =>
      db.estatistica.update({
        quantidade:    req.body.quantidade,
        tipoContagem:  req.body.tipoContagem,
        dataContagem:  req.body.dataContagem,
        idBairro:      req.body.idBairro
      },
      {
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
    );
  
    app.delete( "/estatistica/:id", (req, res) =>
      db.estatistica.destroy({
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
    );
  })
}