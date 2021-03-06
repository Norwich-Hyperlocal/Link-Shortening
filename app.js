'use strict';

/* Declare dependencies */
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var validator = require("validator");
var ip = require("ip");
var couchDB = require("node-couchdb");
var couch = new couchDB("127.0.0.1", 5984);
var couchMethods = require("./lib/methods")(couch, http);


var app = module.exports = express();

var database = "links";
var port = 80;
var ipAddr = ip.address();
var validatorConfig =  {protocols:['http', 'https'], require_tld: false, require_protocol: true, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false};

/* config */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/* Does database exist!? */
var databaseExist = couchMethods._getDatabase(database, function(res1) {
	if(res1.error == "not_found") {
		console.log("OH NOES, NO DATABASE, let's make one");
		couchMethods._create(database, function(mes) {
			console.log(mes);
		});	
	} else {
		console.log("Database is here, no need to panic");
	}

});

/* Handle Post To API */
/* TODO: replace anonymous functions with routes */
app.post('/api/store', function(req, res) {
	//Get url to store from query body
	var query = req["body"], url = query.url;
	var uID = 0;
	//TODO: Implement a better uID system!!
	var linkCount = couchMethods._getDatabase(database, function(res1) {
	//Increment our ID counter
	uID = (res1["doc_count"]+1).toString(32);
	/* Check url */
	var isUrl = validator.isURL(url, validatorConfig);
		//If the url isn't valid tell the user
		if(!isUrl) {
			res.write(JSON.stringify({res: null, info: "Invalid Url", ip: ipAddr}));
			//Then end the page write
			res.end();
		} 
		//Otherwise create a request to store the url in the database and write the uID on completion
		store(uID, url, function(err) {
			//Return the results
			if(err) {
				res.write(JSON.stringify({info: err}));
				res.end();
			} else {
				res.write(JSON.stringify({res: uID, info: err, ip:ipAddr}));
				res.end();
			}					
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
	couchMethods._get(database, newData, function(res, err) {
		callback(res["data"], err);
	});
}


/* Store POSTed data as new field in database */
function store(id, url, callback) {
	var newData = {_id: id, url: url};
	var stuffs = "";
	couchMethods._insert(database, newData, function(err) {
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

app.get('/:url', function(req, res) {
	var url = req.params.url;
	//See if the database has the magic redirect
	var request = get(url, function(data, err) {
		if(data.url !== undefined) {
			res.redirect(data.url);		
		} else {	
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write("404, redirect not found");
			res.write("<br/>");
			res.write("URL for UID: " + url + "<br/>" + " Could not be found :(");
			res.write("<b>But remember.. things could be worse!</b>");
			res.end();
		}
	
	});
});


app.listen(port);



//_update(database, { _id:"linkid", _rev:"1-xxx", link:["poohttp://www.google.com"]}, function(stuff) {
//	console.log(stuff);
//
//
//}); 
