var express = require('express');
var postgraphql = require('postgraphql');
var Ddos = require('ddos');
var toobusy = require('toobusy-js');
var mail = require('./mail');
const app = express();
var promise = require('bluebird');
var fs = require('fs');
var mysqlDb = require('mysql-promise')();
mysqlDb.configure({
  "host": "www.imaflora.org",
  "user": "imaflora1",
  "password": require('./password').mysql
});


var options = {
  // Initialization Options
  promiseLib: promise
};

function handleError(err, res) {
  console.log(err);
  res.status(500).json(
        {
          status: 'Internal server error',
          data: err
        }
      );
}

var pgp = require('pg-promise')(options);
const schema = 'exposed';

var config = {
  user: 'postgres', //env var: PGUSER 
  database: 'atlas', //env var: PGDATABASE 
  password: 'password', 
  host: process.env.NODE_ENV === undefined ? process.env.NODE_SERVER || 'geonode' : 'localhost', // Server hosting the postgres database 
  port: 5432, //env var: PGPORT 
  max: 10, // max number of clients in the pool 
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};

console.log(config);


var db = pgp(config);

app.use(function (req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  }
});

app.use((new Ddos()).express);

app.use(function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', {production: 'http://www.imaflora.org', local: '*', network: "*"}[process.env.NODE_ENV]);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.options('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  next();
})


app.post('/api/insertOrUpdateUser', function (req, res) {
  req.on('data', (data) => {
    req = JSON.parse(data.toString());
    db.oneOrNone(`SELECT exposed.insert_or_update_user(
    $1,
    $2,
    $3,
    $4,
    $5
)`, [req.email, req.nome, req.instituicao, req.departamento, req.telefone]).then(() => {
        res.status(200)
          .json({
            status: 'success',
            message: 'Updated'
          });
        return;
      }).catch((err) => handleError(err, res))
  })
})

app.post('/api/sendComment', function (req, res) {
  req.on('data', (data) => {
    req = JSON.parse(data.toString());
    mail.sendMail(req.email, req.name, req.comment);
    res.status(200)
      .json({
        status: 'success',
        message: 'Updated'
      });
    return;
  })
}
);


app.get('/api/mailNoMore/:email', (req, res, next) => {
  db.one(`
    SELECT exposed.mail_no_more($1)`, req.params.email)
    .then(() => {
      res.status(200).json(
        {
          status: 'Seu e-mail foi removido'
        }
      );
    })
    .catch((err) => {console.log(err)});
});


app.use(postgraphql.postgraphql(config, schema, { graphiql: true }));


app.get('/api/publications', (req, res, next) => {
mysqlDb.query("SET SESSION group_concat_max_len = 100000;").then(() => {
    mysqlDb.query('SELECT * FROM ima_site.v_atlas_publicacoes').then((data) => {
      res.status(200).json(
        {
          status: 'success',
          data: JSON.parse(data[0][0].json)
        }
      );
    })
    .catch((err) => handleError(err, res));
  })
  .catch((err) => handleError(err, res));
});


app.get('/api/news', (req, res, next) => {
mysqlDb.query("SET SESSION group_concat_max_len = 100000;").then(() => {
    mysqlDb.query('SELECT * FROM ima_site.v_atlas_noticias').then((data) => {
      var result = JSON.parse(data[0][0].json);
      console.log(result);
      for (i in result) {
        var links = result[i].resumo.match(/http:\/\/[A-Za-z0-9\-\.\_\~\:\/\?#\[\]@!$&\'\(\)\*+]*/);
        result[i].link = '';
        if (links)
          result[i].link = links[0];
      };
      res.status(200).json(
        {
          status: 'success',
          data: result
        }
      );
    })
    .catch((err) => handleError(err, res));
  })
  .catch((err) => handleError(err, res));
});


app.listen(9000);