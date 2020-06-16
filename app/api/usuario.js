require('express-group-routes');

module.exports = (app, db) => {

    app.post("/usuario/requisitar-troca-senha", (req, res) => {
    console.log(req.body)
    db.usuario.update({
      status: 'Nova senha requisitada'
    },
       {
        where: {
          usuario: req.body.usuario
        }
      }).then( (result) => res.json(result) )
    });

    app.group("/admin", (app) => {

      app.get( "/usuario", (req, res) =>
        db.usuario.findAll({
          attributes: { exclude: ['senha'] }
        }).then( (result) => res.json(result) )
      );
  
      app.get( "/usuario/:id", (req, res) =>
        db.usuario.findByPk(req.params.id, {
          attributes: { exclude: ['senha'] }
        }).then( (result) => {
          
          res.json(result)
          
        })
      );
    
      app.post("/usuario", (req, res) =>  
        db.usuario.create({
          nome: req.body.nome,
          usuario: req.body.usuario,
          senha: req.body.senha,
          departamento: req.body.departamento,
          nivelAcesso: req.body.nivelAcesso,
          status: "ativo"
        }).then( (result) => res.json(result) )
      );
    
      app.put( "/usuario/:id", (req, res) =>
        db.usuario.update({
          nome: req.body.nome,
          usuario: req.body.usuario,
          departamento: req.body.departamento,
          nivelAcesso: req.body.nivelAcesso
        },
        {
          where: {
            id: req.params.id
          }
        }).then( (result) => res.json(result) )
      );

      app.patch( "/usuario/senha/:id", (req, res) =>
      db.usuario.update({
        senha: req.body.senha,
        status: 'ativo'
      },
      {
        where: {
          id: req.params.id
        }
      }).then( (result) => res.json(result) )
    );
    
      app.delete( "/usuario/:id", (req, res) =>
        db.usuario.destroy({
          where: {
            id: req.params.id
          }
        }).then( (result) => res.json(result) )
      );
    })
  }