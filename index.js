var XAuth = function(settings){
	var _roles                  = {};
	var _middle                 = settings.beforeAuthorization || [];
	var _onFailureAuthorization = settings.onFailureAuthorization || function(req, res){ res.send(401, 'Unauthorized'); };
	var _getUserRole            = settings.getUserRole || function(req, res){ return req.user && req.user.role; };

  var _canAccessEndpoint = function(roleName, endpoint){
  		if(!_roles[roleName])
  			return false;

			if(_roles[roleName].endpoints.indexOf(endpoint) !== -1)
				return true;

			var extendedRolesArr =  Object.keys(_roles[roleName].extend);
			for(var i = 0, len = extendedRolesArr.length; i < len; i += 1 ){
				if(_canAccessEndpoint(extendedRolesArr[i], endpoint)){
					return true;
				}
			}

			return false;
  };

  this.register = function(roleName){
		_roles[roleName] = {extend:{}, endpoints:[]};
  };

  this.extend = function(parentRoleName, childRoleName){
		if(_roles[parentRoleName] && childRoleName){
		  _roles[parentRoleName].extend[childRoleName] = 1;
		}
  };

  this.canAccess = function(roleName, endpoints){
		if(_roles[roleName] && endpoints){
		   _roles[roleName].endpoints = _roles[roleName].endpoints.concat(endpoints);
		}
  };

  this.endpoint = function(endpointName){
  	return _middle.concat(function(req, res, next) {
	    if(_canAccessEndpoint(_getUserRole(req, res), endpointName)){
	      next();
	    }else{
	      _onFailureAuthorization(req, res);
	    }
  	});
	};
};

module.exports = XAuth;