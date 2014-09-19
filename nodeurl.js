//npm install -g sqlite3

var config = require('./config');
var queries = require('./queries');
var templates = require('./templates');

var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("url-db");

db.serialize(function () {
    //db.run("Drop TABLE urls");
    db.run(queries.create);
});


http.createServer(function (req, res) {
    var url_parts = url.parse(req.url, true);
    var shorturl = url_parts.pathname.replace("/", "");

    if (url_parts.pathname === "/favicon.ico") {
        serveFavicon(res);
        return;
    }

    if (shorturl) {
        doRedirectFromShorturl(shorturl, res);
    } else {
        var query = url_parts.query;
        if (query.url && url.parse(query.url)) {
            insertUrl(query,req,res);
        } else {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8'
            });
            res.end(getHtml());
        }
    }

}).listen(config.http.port, "");

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


function insertUrl(urlquery, req, res) {
    var shasum = crypto.createHash('sha512');
    shasum.update(urlquery.url);
    var short = shasum.digest('hex');
    short = short.substring(0, 6);
    db.get(queries.selectByShort, short, function (err, row) {
        if (!err && !row) {
            db.run(queries.insertUrl, urlquery.url, short);
        }
        if (row && row.url !== urlquery.url) {
            res.end("Sorry there was a hash collision in the Database.");
        } else {
            var u = req.headers.host + "/" + short;
            res.end('<a href="/' + short + '">' + u.href + '</a>');
        }
    });
}