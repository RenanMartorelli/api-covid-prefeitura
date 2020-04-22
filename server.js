
import express from "express";
import bodyParser from "body-parser";
import faker from "faker";
import times from "lodash.times";
import random from "lodash.random";
import db from "./models";
import cors from 'cors';
import apiEstatistica from "./app/api/estatistica";
import apiUsuario from "./app/api/usuario";
import apiMensagem from "./app/api/mensagem";
import apiAuth from "./app/api/auth";
import apiBairro from "./app/api/bairro"
const passport = require('passport');
require('./auth/passport')

var corsOptions = {
  origin: 'http://localhost:8080'
}

express.application.prefix = express.Router.prefix = function (path, configure) {
  var router = express.Router();
  this.use(path, router);
  configure(router);
  return router;
};

const app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions))
app.use(express.static("app/public"));
// app.use('/admin*',passport.authenticate('jwt', {session: false}));
apiEstatistica(app, db);
apiUsuario(app, db);
apiMensagem(app, db)
apiBairro(app, db);
apiAuth(app, db)

db.sequelize.sync().then(() => { 
  //   populate author table with dummy data
//   db.usuario.bulkCreate(
//     times(10, () => ({
//       nome: faker.name.firstName(),
//       usuario: faker.name.lastName()
//     }))
//   );

//   populate author table with dummy data
//   db.usuario.bulkCreate(
//     times(10, () => ({
//       nome: faker.name.firstName(),
//       usuario: faker.name.lastName()
//     }))
//   );
  app.listen(8000, () => console.log("App listening on port 8000!"));
  process.on('SIGINT', () => { console.log("Bye bye!"); process.exit(); });
});