var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const sequelize = require('./database/sequelize'); 
//Importer les routers
const routerAuth = require('./routes/authentification');
const routerFields = require('./routes/fields');
const routerReservations = require('./routes/reservations');
// Charger la documentation OpenAPI (swagger.yaml)
const swaggerDocument = YAML.load(path.join(__dirname, '..', 'openapi.yaml')); 

var app = express();
const { graphqlHTTP } = require('express-graphql');
const schema = require("./routes/graphql-route");

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Enregistrement des routes
 */

//Enregistrement d'un middleware actif uniquement en env de dev
//Si on veut autoriser une application web à lire la réponse,
//il faut moduler la SOP avec une politique CORS plus permissive.
//Autoriser les requêtes Cross Origin (CORS Policy)
if (process.env && process.env.ENV == 'dev') {
  app.use((req, res, next) => {
    //En production, on n'autorisera pas l'accès aux autres sites web à notre API ainsi, sans aucune restriction
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    next();
  })
}


sequelize.authenticate()
  .then(() => console.log('La connexion à la base de données a réussi !'))
  .catch((err) => console.error('mpossible de se connecter à la base de données:', err));


// Swagger UI pour visualiser la documentation OpenAPI
app.use('/doc-openapi', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Graphql 
app.use(
  "/doc-graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true  
  })
);

  app.get('/', (req, res) => {
    res.json({
      message: 'Bienvenue sur l\'API Badminton! de TOM et PRINCE',
      instructions: 'Cliquez sur le lien ci-dessous pour tester toutes les routes de l\'API via Swagger UI:',
      links: {
        'Swagger UI OPENAPI': 'http://localhost:3000/doc-openapi',
        'GraphQL Playground': 'http://localhost:3000/doc-graphql',
        'Adminer Base de données': 'http://localhost:8080'
      }
    });
  });
app.use(routerAuth, routerFields, routerReservations);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Error');
});




var port = process.env.HOST_PORT_API || 3002; 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



module.exports = app;
