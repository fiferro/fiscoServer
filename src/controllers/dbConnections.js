var config = require('../config'),
  mysql = require('mysql'),
  Promise = require("bluebird");

Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var conn = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
});

function getSqlConnection() {
  return conn.getConnectionAsync().disposer(function (connection) {
    connection.release();
  });
}


function querySql(query, params) {
  return Promise.using(getSqlConnection(), function (connection) {
    if (typeof params !== 'undefined') {
      return connection.queryAsync(query, params);
    } else {
      return connection.queryAsync(query);
    }
  });
};

function insertSql(insert) {
  return Promise.using(getSqlConnection(), function (connection) {
    return connection.queryAsync(insert);
  });
}

function deleteSql(insert) {
  return Promise.using(getSqlConnection(), function (connection) {
    return connection.queryAsync(insert);
  });
}

function Hash(hash) {
  var userQuery = "select * from UsersLog where logHash = '" + hash + "'";
  return Promise.using(getSqlConnection(), function (connection) {
    return connection.queryAsync(userQuery);
  });
}
module.exports = {
  getSqlConnection: getSqlConnection,
  querySql: querySql,
  insertSql: insertSql,
  deleteSql: deleteSql, 
  Hash : Hash
};