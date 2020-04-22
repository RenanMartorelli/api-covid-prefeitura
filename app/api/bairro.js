require('express-group-routes');

module.exports = (app, db) => {

    app.group("/admin", (app) => {

      app.get( "/bairro", (req, res) =>
        db.bairro.findAll().then( (result) => res.json(result) )
      );
  
      app.get( "/bairro/:id", (req, res) =>
        db.bairro.findByPk(req.params.id).then( (result) => {
          
          res.json(result)
          
        })
      );
    
      app.post("/bairro", (req, res) =>  
        db.bairro.create({
          nome: req.body.nome,
        }).then( (result) => res.json(result) )
      );
    
      app.put( "/bairro/:id", (req, res) =>
        db.bairro.update({
          nome: req.body.nome,
        },
        {
          where: {
            id: req.params.id
          }
        }).then( (result) => res.json(result) )
      );

      app.delete( "/bairro/:id", (req, res) =>
        db.bairro.destroy({
          where: {
            id: req.params.id
          }
        }).then( (result) => res.json(result) )
      );
    })
  }