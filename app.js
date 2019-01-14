var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();


var con = mysql.createConnection({
  host: "br734.hostgator.com.br",
  port     : '3306',
  user: "toaki932_fferro",
  password : 'Luca@2010',
  database : 'toaki932_dev'
});

app.use(bodyParser.json());

app.get( '/user', function(req,res){
  con.query('select sysdate()', function (err, result) {
    if (err) throw err;
    res.send(JSON.stringify(result));
  });
} )
app.get('/maps', function(req, res) {
    var dados = [
      {
        lat: -25.470991, 
        lon: -49.271036
      },
      {
        lat: -0.935586,
        lon: -49.635540
      },
      {
        lat: -2.485874, 
        lon: -43.128493
      }
    ];
  
    res.send(JSON.stringify(dados));
  });

  
app.listen(8000, function() {
    console.log('Servidor rodando na porta 8000.');
  });