### Installation

```
$ npm install x-auth
```
### Usage

```javascript
var express = require('express');
var router  = express.Router();
var XAuth 	= require('x-auth');

var xAuth = new XAuth({
    getUserRole: function(req, res){
    	return "Admin";
    },
    beforeAuthorization: [
			// middleware functions are executed before Authorization function
			function(req, res, next){

				next();
			},
			function(req, res, next){

				next();
			}
    ],
    onFailureAuthorization: function(req, res){
			res.send(401, 'Unauthorized');
  	}
});

// register roles
xAuth.register("User");
xAuth.register("Admin");

// Admin extends User and gets access to everything that User can access.
xAuth.extend('Admin', 'User');

// User can access 'home' endpoint.
// Admin extends User, so Admin also has access to 'home' endpoint.
xAuth.canAccess('User', ['home']);

router.use('/theme', require('./controllers/ThemeController')({xAuth: xAuth}).router);

module.exports = router;
```

inside: ./controllers/ThemeController

```javascript
var express = require('express');
var router  = express.Router();

var Controller = function(settings){

	router.get(
		'/',
		// add route endpoint
		settings.xAuth.endpoint('home').concat(
		function(req, res) {
			
			
	}));
	
	return {
		router: router
	};
};

module.exports = Controller;
```