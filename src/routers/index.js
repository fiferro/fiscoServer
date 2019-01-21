
var router = require('express').Router(),
    bodyParser = require('body-parser'),
    express = require("express"),
    basicAuth = require('express-basic-auth');

var app = express();

app.use(bodyParser.json());

// Allow all CORS origins
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.use(basicAuth({
    users: { 'admin': 'fisco' }
}))

router.get('/', function (req, res, next) {
    res.status(200).send({
        title: "Api em execução",
        version: "0.0.1"
    });
});


router.use('/fisco', require('./service/users'));
router.use('/empresa', require('./service/empresa'));



module.exports = router;