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


router.post("/users/login", function (req, res) {
  let usuario = req.body.usuario;
  let pass = md5(req.body.pass);
  var userQuery = "select * from Users where email = '" + usuario + "' and password = '" + pass + "'";
  return querySql(userQuery, '')
    .then(function (rows) {
      if (rows.length == 0) {
        res.status(500).json({ 'return': '0' });
      }
      else {
        let hashcode = passwordHash.generate(req.body.usuario + req.body.pass)
        var userInsert = "INSERT INTO UsersLog (logHash) VALUES ('" + hashcode + "')";
        return db.insertSql(userInsert)
          .then(function (returns) {
            res.status(200).json({
              'return': 'home.html',
              'hash': hashcode
            });
          });
      }
    });
});


router.post("/users", function (req, res) {
  return db.Hash(req.headers.authorization)
    .then(function (valid) {
      if (valid.length == 0) {
        res.status(500).json('unauthorized');
      }
      else {
        var userInsert = "INSERT INTO Users (name, email, password) VALUES ('" + req.body.name + "','" + req.body.email + "','" + passwordHash.generate(req.body.pass) + "')";
        return db.insertSql(userInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
          });
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
        var userInsert = "update Users set name = '" + req.body.name + "',email = '" + req.body.email + "', password = '" + req.body.pass + "' where idUser = " + req.body.idUser;
        return db.insertSql(userInsert)
          .then(function (returns) {
            res.status(200).json({ returns });
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