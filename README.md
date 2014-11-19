### Installation

```
$ npm install x-auth
```
### Usage

```javascript
var express = require('express');
var router  = express.Router();

var xAuth = new XAuth({
    getUserRole: function(req, res){
    	return "Admin";
    },
    beforeAuthorization: [
			// middleware functions executed before Authorization function
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

xAuth.register("User");
xAuth.register("Admin");

xAuth.extend('Admin', 'User');

xAuth.canAccess('User', ['themebox']);

router.use('/theme', require('./controllers/ThemeController')({xAuth: xAuth}).router);

module.exports = router;
```

```javascript
var express = require('express');
var router  = express.Router();

var Controller = function(settings){

	router.get(
		'/', 
		settings.xAuth.endpoint('themebox').concat(
		function(req, res) {
			
			
	}));
	
	return {
		router: router
	};
};

module.exports = Controller;
```