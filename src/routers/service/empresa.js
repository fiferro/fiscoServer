var router = require('express').Router(),
    express = require("express"),
    bodyParser = require('body-parser'),
    conSql = require('../../controllers/dbConnections'),
    db = require('../../controllers/dbConnections'),
    mysql = require('mysql'),
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

router.get("/empresa/:cnpj", function (req, res) {
    return db.Hash(req.headers.authorization)
        .then(function (valid) {
            if (valid.length == 0) {
                res.status(500).json('unauthorized');
            }
            else {
                var userQuery = "select * from fis_empresa where cnpj = '" + req.params.cnpj.replace('+', '/') + "'";
                return querySql(userQuery, '', req.headers.authorization)
                    .then(function (rows) {
                        res.status(200).json({ rows });
                    });
            }


        })
});

router.get("/empresa/usuario/:id", function (req, res) {
    return db.Hash(req.headers.authorization)
        .then(function (valid) {
            if (valid.length == 0) {
                res.status(500).json('unauthorized');
            }
            else {
                var userQuery = "SELECT * FROM fis_empresa_usuario feu inner join fis_empresa fe on fe.id_empresa = feu.id_empresa "
                userQuery += "where feu.id_usuario = '" + req.params.id + "'";
                return querySql(userQuery, '', req.headers.authorization)
                    .then(function (rows) {
                        res.status(200).json({
                            'status': 'success',
                            'Empr': rows
                        });
                    });
            }


        })
});

router.get("/empresa/usuario/minha/:id", function (req, res) {
    return db.Hash(req.headers.authorization)
        .then(function (valid) {
            if (valid.length == 0) {
                res.status(500).json('unauthorized');
            }
            else {
                var userQuery = "SELECT * FROM fis_usuario_empresa fue inner join fis_usuario fu on fu.id_usuario = fue.id_usuario inner join fis_empresa fe on fe.id_empresa = fue.id_empresa "
                userQuery += "where fue.id_usuario = '" + req.params.id + "'";
                return querySql(userQuery, '', req.headers.authorization)
                    .then(function (rows) {
                        res.status(200).json({
                            'status': 'success',
                            'Empr': rows
                        });
                    });
            }


        })
});

router.post("/empresa", function (req, res) {

    var userQuery = "select * from fis_empresa where cnpj = '" + req.body.cnpj + "'";
    return querySql(userQuery, '')
        .then(function (rows) {
            if (rows.length == 0) {
                var userInsert = "INSERT INTO fis_empresa (razao_social, endereco, cnpj) VALUES ("
                userInsert += "'" + req.body.rsocial + "','" + req.body.endereco + "','" + req.body.cnpj + "')";
                return db.insertSql(userInsert)
                    .then(function (returns) {
                        var userInsert = "INSERT INTO fis_empresa_usuario (	id_empresa, id_usuario, tipo_pagamento, valor) VALUES ('"
                        userInsert += returns.insertId + "','" + req.body.id + "','" + req.body.tpPag + "','" + req.body.vlr + "')";
                        return db.insertSql(userInsert)
                            .then(function (returns) {
                                res.status(200).json({
                                    'status': 'success'
                                });
                            });
                    });
            }
            else {
                var userInsert = "INSERT INTO fis_empresa_usuario (	id_empresa, id_usuario, tipo_pagamento, valor) VALUES ('"
                userInsert += rows[0].id_empresa + "','" + req.body.id + "','" + req.body.tpPag + "','" + req.body.vlr + "')";
                return db.insertSql(userInsert)
                    .then(function (returns) {
                        res.status(200).json({
                            'status': 'success'
                        });
                    });
            }
        });
});

router.post("/empresa/nova", function (req, res) {
    return db.Hash(req.headers.authorization)
        .then(function (valid) {
            var userInsert = "INSERT INTO fis_empresa (razao_social, endereco, cnpj, cep, uf, cidade, numero, complemento, bairro, telefone, email, apelido) VALUES ("
            userInsert += "'" + req.body.razao + "','" + req.body.logradouro + "','" + req.body.CNPJ + "','" + req.body.cep + "','" + req.body.uf + "','" + req.body.cidade + "','" + req.body.numero + "'";
            userInsert += ",'" + req.body.complemento + "','" + req.body.bairro + "','" + req.body.telefone + "','" + req.body.email + "','" + req.body.apelido + "')";
            return db.insertSql(userInsert)
                .then(function (returns) {
                    res.status(200).json({
                        'status': 'success'
                    });
                });
        });
});

router.post("/empresa/minha", function (req, res) {
    return db.Hash(req.headers.authorization)
        .then(function (valid) {
            var userQuery = "select * from fis_empresa where cnpj = '" + req.body.CNPJ + "'";
            return querySql(userQuery, '')
                .then(function (rows) {
                    if (rows.length == 0) {
                        var userInsert = "INSERT INTO fis_empresa (razao_social, endereco, cnpj, cep, uf, cidade, numero, complemento, bairro, telefone, email, apelido, ie) VALUES ("
                        userInsert += "'" + req.body.razao + "','" + req.body.logradouro + "','" + req.body.CNPJ + "','" + req.body.cep + "','" + req.body.uf + "','" + req.body.cidade + "','" + req.body.numero + "'";
                        userInsert += ",'" + req.body.complemento + "','" + req.body.bairro + "','" + req.body.telefone + "','" + req.body.email + "','" + req.body.apelido + "','" + req.body.ie + "')";
                        return db.insertSql(userInsert)
                            .then(function (returns) {
                                var userInsert = "INSERT INTO fis_usuario_empresa (	id_empresa, id_usuario) VALUES ('"
                                userInsert += returns.insertId + "','" + req.body.id + "')";
                                return db.insertSql(userInsert)
                                    .then(function (returns) {
                                        res.status(200).json({
                                            'status': 'success'
                                        });
                                    });
                            });
                    }
                    else {
                        var userInsert = "update fis_empresa set "
                        userInsert += "razao_social = '" + req.body.razao + "',"
                        userInsert += "endereco = '" + req.body.logradouro + "',"
                        userInsert += "cnpj = '" + req.body.CNPJ + "',"
                        userInsert += "cep = '" + req.body.cep + "',"
                        userInsert += "uf = '" + req.body.uf + "',"
                        userInsert += "cidade = '" + req.body.cidade + "',"
                        userInsert += "numero = '" + req.body.numero + "',"
                        userInsert += "complemento = '" + req.body.complemento + "',"
                        userInsert += "bairro = '" + req.body.bairro + "',"
                        userInsert += "telefone = '" + req.body.telefone + "',"
                        userInsert += "email = '" + req.body.email + "',"
                        userInsert += "apelido = '" + req.body.apelido + "',"
                        userInsert += "ie = '" + req.body.ie + "'"
                        userInsert += "where id_empresa = " + rows[0].id_empresa;
                        return db.insertSql(userInsert)
                            .then(function (returns) {
                                var userInsert = "INSERT INTO fis_usuario_empresa (	id_empresa, id_usuario) VALUES ('"
                                userInsert += rows[0].id_empresa + "','" + req.body.id + "')";
                                return db.insertSql(userInsert)
                                    .then(function (returns) {
                                        res.status(200).json({ 'status': 'success' });
                                    });
                            });
                    }
                });
        });
});

router.patch("/empresa/minha", function (req, res) {

    var userInsert = "update fis_empresa set "
    userInsert += "razao_social = '" + req.body.razao + "',"
    userInsert += "endereco = '" + req.body.logradouro + "',"
    userInsert += "cnpj = '" + req.body.CNPJ + "',"
    userInsert += "cep = '" + req.body.cep + "',"
    userInsert += "uf = '" + req.body.uf + "',"
    userInsert += "cidade = '" + req.body.cidade + "',"
    userInsert += "numero = '" + req.body.numero + "',"
    userInsert += "complemento = '" + req.body.complemento + "',"
    userInsert += "bairro = '" + req.body.bairro + "',"
    userInsert += "telefone = '" + req.body.telefone + "',"
    userInsert += "email = '" + req.body.email + "',"
    userInsert += "apelido = '" + req.body.apelido + "',"
    userInsert += "ie = '" + req.body.ie + "'"
    userInsert += "where id_empresa = " + req.body.id_empresa;
    return db.insertSql(userInsert)
        .then(function (returns) {
            res.status(200).json({ 'status': 'success' });

        });
});

router.patch("/empresa", function (req, res) {
    return db.Hash(req.headers.authorization)
        .then(function (valid) {
            if (valid.length == 0) {
                res.status(500).json('unauthorized');
            }
            else {
                var userInsert = "update fis_empresa_usuario set tipo_pagamento = '" + req.body.tipo_pagamento + "', valor = '" + req.body.valor + "' where id_empresa_usuario = " + req.body.id_empresa_usuario;
                return db.insertSql(userInsert)
                    .then(function (returns) {
                        res.status(200).json({ 'status': 'success' });
                    });
            }
        });
});

router.delete("/empresa", function (req, res) {
    return db.Hash(req.headers.authorization)
        .then(function (valid) {
            if (valid.length == 0) {
                res.status(500).json('unauthorized');
            }
            else {
                var userDelete = "delete from fis_empresa_usuario where id_empresa_usuario = " + req.body.id_empresa_usuario;
                return db.deleteSql(userDelete)
                    .then(function (returns) {
                        res.status(200).json({ returns });
                    });
            }
        });
});

module.exports = router;