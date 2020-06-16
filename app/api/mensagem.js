require('express-group-routes');

module.exports = (app, db) => {

  app.get( "/mensagem", (req, res) =>
    db.mensagem.findAll().then( (result) => res.json(result) )
  );

  app.group("/admin", (app) => {
  
    app.get( "/mensagem/:id", (req, res) =>
      db.mensagem.findByPk(req.params.id).then( (result) => res.json(result))
    );
  
    app.post("/mensagem", (req, res) => 
      db.mensagem.create({
        titulo: req.body.titulo,
        texto: req.body.texto,
        tipo:  req.body.tipo
      }).then( (result) => res.json(result) )
    );
  
    app.put( "/mensagem/:id", (req, res) =>
      db.mensagem.update({
        titulo: req.body.titulo,
        texto: req.body.texto,
        tipo:  req.body.tipo
      },
      {
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
    );
  
    app.delete( "/mensagem/:id", (req, res) =>
      db.mensagem.destroy({
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
    );
  })
}