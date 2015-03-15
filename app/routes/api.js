/**
 * Created by trevor on 3/14/15.
 */
var bodyParser = require('body-parser'),	// get body-parser
    User       = require('../models/user'),
    jwt        = require('jsonwebtoken'),
    config     = require('../../config'),
    expressJwt = require('express-jwt');

// secret for creating tokens
var secret = config.secret;

module.exports = function(app, express) {
    var apiRouter = express.Router();

    //authenticate route, give token
    apiRouter.post('/authenticate', function (req, res) {
        // find the user
        User.findOne({
            username: req.body.username
        }).select('name username password').exec(function(err, user) {

            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    // if user is found and password is right
                    // create a token
                    var profile = {
                        name: user.name,
                        email: user.email,
                        id: user._id
                    };

                    // We are sending the profile inside the token
                    var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        token: token
                    });
                }
            }
        });


        //TODO validate req.body.username and req.body.password
        //if is invalid, return 401
        if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
            res.status(401).send('Wrong user or password');
            return;
        }


        res.json({ token: token });
    });

    //make middleware for expressJwt
    apiRouter.use(expressJwt({secret: config.secret}));

    //========================================================================
    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')

        // create a user (accessed at POST http://localhost:8080/users)
        .post(function(req, res) {
            var user = new User();		// create a new instance of the User model
            user.name = req.body.name;  // set the users name (comes from the request)
            user.email = req.body.email;  // set the users username (comes from the request)
            user.password = req.body.password;  // set the users password (comes from the request)
            user.userInfo.address = req.body.address; //set the users address (comes from the request)
            user.userInfo.address2 = req.body.address2; //set the users address2 (comes from the request)
            user.userInfo.city = req.body.city; //set the users city (comes from the request)
            user.userInfo.state = req.body.state; //set the users state (comes from the request)
            user.userInfo.zip = req.body.zip; //set the users zip (comes from the request)
            user.userInfo.homePhone = req.body.homePhone; //set the users homePhone (comes from the request)
            user.userInfo.cellPhone = req.body.cellPhone; //set the users cellPhone (comes from the request)

            user.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({ success: false, message: 'A user with that username already exists. '});
                    else
                        return res.send(err);
                }

                // return a message
                res.json({ message: 'User created!' });
            });

        })

        // get all the users (accessed at GET http://localhost:8080/api/users)
        .get(function(req, res) {

            User.find({}, function(err, users) {
                if (err) res.send(err);

                // return the users
                res.json(users);
            });
        });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')

        // get the user with that id
        .get(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err) res.send(err);

                // return that user
                res.json(user);
            });
        })

        // update the user with this id
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {

                if (err) res.send(err);

                // set the new user information if it exists in the request
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;
                if (req.body.address) user.userInfo.address = req.body.address;
                if (req.body.address2) user.userInfo.address2 = req.body.address2;
                if (req.body.city) user.userInfo.city = req.body.city;
                if (req.body.state) user.userInfo.state = req.body.state;
                if (req.body.zip) user.userInfo.zip = req.body.zip;
                if (req.body.homePhone) user.userInfo.homePhone = req.body.homePhone;
                if (req.body.cellPhone) user.userInfo.cellPhone = req.body.cellPhone;

                // save the user
                user.save(function(err) {
                    if (err) res.send(err);

                    // return a message
                    res.json({ message: 'User updated!' });
                });

            });
        })

        // delete the user with this id
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err) res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });


    // api endpoint to get user information
    apiRouter.get('/me', function(req, res) {
        res.send(req.user);
    });

    return apiRouter;
}