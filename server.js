//get our packages
var express     = require('express'),
    app         = express(),
    path        = require('path'),
    morgan      = require('morgan'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    config      = require('./config');

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (hosted on modulus.io)
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, '/public/app/views')); // Convenience since it's the fault anyway.
app.set('view engine', 'jade');

// ROUTES FOR OUR API =================
// ====================================

// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
// We are going to protect /api routes with JWT
app.use('/api', apiRoutes);
//app.use(express.json());
//app.use(express.urlencoded());


app.get('/pages/:name', function (req, res)
{ var name = req.params.name;
    console.log('rendering partials : ' + name);
    res.render('pages/' + name);
});

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
    res.render('index');
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);