var router = require('express').Router(),
  express = require("express"),
  bodyParser = require('body-parser'),
  conSql = require('../../controllers/dbConnections'),
  db = require('../../controllers/dbConnections'),
  md5 = require('md5'),
  mysql = require('mysql'),
  passwordHash = require('password-hash'),
  auth = require('basic-auth');
// rotas a serem chamadas a partir de /abaco. 
// para melhor direcionar o desenvolvimento as informações de usuarios deverão ficar aqui 
var getSqlConnection = db.getSqlConnection;
var querySql = db.querySql;

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

router.get("/users", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "select * from Users";
        return querySql(userQuery, '', req.headers.authorization)
          .then(function (rows) {
            res.status(200).json({ rows });
          });
      }


    })
});

router.get("/users/login", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userQuery = "SELECT * FROM fis_usuario_log fl  inner join fis_usuario fu on fu.id_usuario = fl.id_usuario where fl.logHash = '"+ req.headers.authorization +"'";
        
        return querySql(userQuery, '', req.headers.authorization)
          .then(function (rows) {
            res.status(200).json({
              'hash': req.headers.authorization, 
              'status': 'success', 
              'user': rows
            });
          });
      }


    })
});


router.post("/users/login", function (req, res) {
  let usuario = req.body.email;
  let pass = md5(req.body.senha);
  var userQuery = "select * from fis_usuario where email = '" + usuario + "' and senha = '" + pass + "'";
  return querySql(userQuery, '')
    .then(function (rows) {
      if (rows.length == 0) {
        res.status(500).json({ 'return': '0' });
      }
      else {
        let hashcode = passwordHash.generate(usuario + req.body.senha) 
        var userInsert = "INSERT INTO fis_usuario_log (id_usuario, logHash) VALUES ('"+ rows[0].id_usuario + "','" + hashcode + "')";
        return db.insertSql(userInsert)
          .then(function (returns) {
            res.status(200).json({
              'return': 'home.html',
              'hash': hashcode, 
              'status': 'success', 
              'user': rows
            });
          });
      }
    });
});


router.post("/users", function (req, res) {

  let usuario = req.body.email;
  let pass =md5(req.body.senha)
  var userQuery = "select * from fis_usuario where email = '" + usuario + "'";
  return querySql(userQuery, '')
    .then(function (rows) {
      if (rows.length == 0) {
        var userInsert = "INSERT INTO fis_usuario (nome, cpf, telefone, email, senha, dt_nascimento, sexo) VALUES ("
        userInsert +=  "'" + req.body.nome + "','" + req.body.cpf + "','" + req.body.tel + "','" + req.body.email + "','" + pass + "','" + req.body.dtnasc + "','" + req.body.sexo + "')";
        return db.insertSql(userInsert)
          .then(function (returns) {
            let hashcode = passwordHash.generate(usuario + req.body.senha) 
            var userInsert = "INSERT INTO fis_usuario_log (id_usuario, logHash) VALUES ('"+ returns.insertId + "','" + hashcode + "')";
            return db.insertSql(userInsert)
              .then(function (returns) {
                res.status(200).json({
                  'return': 'home.html',
                  'hash': hashcode, 
                  'status': 'success', 
                  'user': returns
                });
              });
          });
      }
      else {
        res.status(200).json({'return': 'usuário já existente '})
      }
    });
});


router.patch("/users", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        console.log(req.body);
        var userInsert = "update fis_usuario set nome = '" + req.body.nome + "',email = '" + req.body.email + "', cpf = '" + req.body.cpf + "', telefone = '" + req.body.telefone + "' where id_usuario = " + req.body.id_user;
        return db.insertSql(userInsert)
          .then(function (returns) {
            res.status(200).json({ 'status': 'success' });
          });
      }
    });
});

router.delete("/users", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userDelete = "delete from Users where idUser = " + req.body.idUser;
        return db.deleteSql(userDelete)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
      }
    });
});





module.exports = router;