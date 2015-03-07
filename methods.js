
module.exports = function(couch) {
var module = {};
/* Get an item from the database
 * @param {string} the database name
 * @param {array} contains id and revision(if needed)
	@param {string} id
	@param {string} revision(optional)
 * @param {function} callback with data
*/
exports._get = function(database, params, callback) {
	couch.get(database, params[0], function(err, data) {
		if(err)
			callback(err);
		callback(data);
	});
}
/* Delete an item from the database
 * @param {string} the database name
 * @param {function} callback with data
*/
exports._create = function(database, callback) {
	couch.createDatabase(database, function(err) {
		if(err)
			callback(err);
		else callback("Database: " + database + " created!");	
	});
}

/* Delete an item from the database
 * @param {string} the database name
 * @param {object} contains id and revision
	@param {string} id
	@param {string} revision
 * @param {function} callback with data
*/
exports._insert = function(database, data, callback) {
	couch.insert(database, data, function(err, data) {
		if(err)
			callback(err);
		callback(data);
	});
}
/* Delete an item from the database
 * @param {string} the database name
 * @param {object} contains id and revision
	@param {string} id
	@param {string} revision
 * @param {function} callback with data
*/
exports._update = function(database, data, callback) {
	_getRev(database, data["_id"], function(rev) {
		data["_rev"] = rev;
		couch.update(database, data, function(err, res) {
			if(err)
				callback(err);
			callback(res);
		});
	});
};

/* gets the revision for an id */
exports._getRev = function(database, id, callback) {
	_get(database, [id], function(data) {
		var rev = data["data"]["_rev"];
		callback(rev);
	});
}

/* Delete an item from the database
 * @param {string} the database name
 * @param {object} contains id and revision
	@param {string} id
	@param {string} revision
 * @param {function} callback with data
*/
exports._delete = function(database, data, callback) {
	couch.del(database, data[0], data[1], function(err, data) {
		if(err)
			callback(err);
		callback(data);
	});
}

/* drops specified database */
exports._drop = function(database, callback) {
	couch.dropDatabase(database, function(err) {
		callback(err);
	});
}

exports._getUID = function(database, data, callback) {
	couch.uniqid(1, function(err, ids) {
		if(err)
			callback(err);
		callback(ids);
	});
}
return exports;
//module.exports = global;
};
