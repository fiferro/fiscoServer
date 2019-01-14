var mysql = require('mysql');

var con = mysql.createConnection({
  host: "br734.hostgator.com.br",
  port     : '3306',
  user: "toaki932_fferro",
  password : 'Luca@2010',
  database : 'toaki932_dev'
});

con.connect(function(err) {
  if (err) throw err;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});