//npm install -g sqlite3

var config = require('./config');
var queries = require('./queries');
var templates = require('./templates');

var http = require('http');
var https = require('https');
var path = require('path');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(config.db.filename);

db.serialize(function () {
    //db.run("Drop TABLE urls");
    db.run(queries.create);
});


if(config.https.enabled && config.https.keyfile && config.https.certfile){
    config.https.key = fs.readFileSync(config.https.keyfile);
    config.https.cert =  fs.readFileSync(config.https.certfile);
    https.createServer(config.https,initServer).listen(config.https.port, "");
}
if(config.http.enabled, config.http.port){
    http.createServer(initServer).listen(config.http.port, "");
}

function serveFile(url,res){
    var pathname = url.pathname;
    var fileRegEx = RegExp(/\w+\.(\w+)$/).exec(pathname);
    var folder = "assets";
    
    if(!fileRegEx) return false;
    
    while(pathname.indexOf("/") === 0){
        pathname = pathname.replace("/","");
    }
    
    switch(fileRegEx[1]){
        case 'js':
            folder = "js";
            res.writeHead(200, {
                'Content-Type': 'text/javascript; charset=UTF-8'
            });
            break;
        case 'css':
            folder = "css";
            res.writeHead(200, {
                'Content-Type': 'text/css; charset=UTF-8'
            });
            break;
         case 'gif':
            folder = "img";
            res.writeHead(200, {
                'Content-Type': 'image/gif;'
            });
            break;
    }
    var filepath = path.join(folder,pathname);
    
    if(fs.existsSync(filepath)){
        var file = fs.readFileSync(filepath);
        if(file){
            res.end(file);
            return true;
        }
    }
    return false;
}

function initServer(req,res){
    var isHttps = req.connection.encrypted ? true : false;
    var url_parts = url.parse(req.url, true);
    var shorturl = url_parts.pathname.replace("/", "");

    if (url_parts.pathname === "/favicon.ico") {
        serveFavicon(res);
        return;
    }
    
    if(serveFile(url_parts,res)){
        return;
    }

    if (shorturl) {
        doRedirectFromShorturl(shorturl, res);
    } else {
        var query = url_parts.query;
        if (query.url && url.parse(query.url)) {
            insertUrl(query,req,res,isHttps);
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8'
            });
            res.end(getHtml());
        }
    }
}

function getHtml(){
    var regex = new RegExp(/<% (\w+) %>/g);
    var html = templates.frame;
    var template_name = "";
    
    while(result = regex.exec(html)){
        var template_name = result[1];
        if(templates[template_name]){
            html = html.replace(result[0],templates[template_name]);
        }
    }
    return html;
}

function serveFavicon(res) {
    res.writeHead(200, {
        'Content-Type': 'image/x-icon;'
    });
    fs.readFile(config.files.favicon, function (err, data) {
        res.end(data);
    });
}

function ensureProtocol(url){
    var regex = /\w+:\/\//;
    var result = regex.exec(url);
    if(result && result.index === 0){
        return url;
    }else{
        return "http://"+url;
    }
}

function doRedirectFromShorturl(shorturl, res) {
    db.get(queries.selectByShort, shorturl.toString(), function (err, row) {
        if (row && row.url) {
            res.writeHead(302, {
                'Location': row.url
            });
        } else if (err) {
            console.log(err);
        }
        res.end("");
    });
}


function insertUrl(urlquery, req, res,isHttps) {
    var shasum = crypto.createHash('sha512');
    shasum.update(urlquery.url);
    var short = shasum.digest('hex');
    short = short.substring(0, 6);
    db.get(queries.selectByShort, short, function (err, row) {
        var u = ensureProtocol(urlquery.url);
        if (!err && !row) {
            if(url.parse(u)){
                db.run(queries.insertUrl, u, short);
            }else{
                res.end("Sorry you didn't enter a URL.");
            }
        }
        if (row && row.url !== u) {
            res.end("Sorry there was a hash collision in the Database.");
        } else {
            var protoc = isHttps ? "https://" : "http://";
            var u = protoc + req.headers.host + "/" + short;
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=UTF-8'
            });
            res.end(u);
        }
    });
}
