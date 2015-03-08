'use strict';

/* Declare dependencies */
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var couchDB = require("node-couchdb");
var couch = new couchDB("127.0.0.1", 5984);
var couchMethods = require("./lib/methods")(couch, http);


var app = module.exports = express();
/* config */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Handle Post To API */
/* TODO: replace anonymous functions with routes */
app.post('/api/store', function(req, res) {
	var query = req["body"], url = query.url;
	var uID = 0;
	//TODO: Add check to see if URL is valid (regex yay). Implement a better uID system!!
	var linkCount = couchMethods._getDatabase("test", function(res1) {
		//Increment our ID counter
		uID = (res1["doc_count"]+1).toString(32);
		var request = store(uID, url, function(err) {
			res.write(JSON.stringify({res: uID, info: err}));
			res.end();	
		});
	}); 	
});

app.get('/api/getdomain', function(req, res) {
	var query = req["query"], url = query.url, id = query.id;
	var request = get(id, function(data, err) {
		res.write(data);
		res.end();
	});
});

/* Get the corresponding url from provided id */
function get(id, callback) {
	var newData = [id];
	var response = "";
	couchMethods._get("test", newData, function(res, err) {
		callback(JSON.stringify(res["data"]), err);
	});
}


/* Store POSTed data as new field in database */
function store(id, url, callback) {
	var newData = {_id: id, url: url};
	var stuffs = "";
	couchMethods._insert("test", newData, function(err) {
		callback(err);
	});
	return stuffs;
}

/* TODO: Add proper routing and templating (EJS or something) */
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.sendFile('index.html');	
	res.end();
});

app.listen(8080);
//_update("test", { _id:"linkid", _rev:"1-xxx", link:["poohttp://www.google.com"]}, function(stuff) {
//	console.log(stuff);
//
//
//}); 
