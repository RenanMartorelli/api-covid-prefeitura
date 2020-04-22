//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import db from "../models";

passport.use(new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'senha'
    }, 
    function (usuario, senha, cb) {
        console.log("passou aqui");
        console.log(usuario,senha);
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return db.usuario.findOne({ where: { usuario: usuario, senha: senha } })
        // var user =  db.usuario.findOne({ where: { usuario: usuario, senha: senha } })
        .then(usuario => {
            // console.log(usuario.dataValues);
               if (!usuario) {
                   return cb(null, false, {message: 'Senha ou e-mail incorretos.'});
               }
               return cb(null, usuario.dataValues, {message: 'Autenticação realizada com sucesso!'});
          })
          .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'your_jwt_secret'
},
function (jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    return db.usuario.findOne({ where: { id: jwtPayload.id } })
    // return UserModel.findOneById(jwtPayload.id)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
    }
));