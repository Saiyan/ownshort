//npm install -g sqlite3

var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');
var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("url-db");

var PORT = 9080;

db.serialize(function() {
  //db.run("Drop TABLE urls");
  db.run("CREATE TABLE IF NOT EXISTS urls  (id INTEGER PRIMARY KEY,url TEXT, short TEXT)");
});
var selquery = "SELECT * FROM urls WHERE short = ?";

function serveFavicon(res){
    res.writeHead(200, {
        'Content-Type': 'image/x-icon;'
    });
    fs.readFile("favicon.ico",function(err,data){
        res.end(data);
    });
}

http.createServer(function(req, res) {
    
    var is_local = url.parse(req.url).host ? "" : "localhost:"+PORT + "/";
    var url_parts = url.parse(req.url, true);
    var shorturl = url_parts.pathname.replace("/","");

    if(url_parts.pathname === "/favicon.ico"){
        serveFavicon(res);
        return;
    }

    if(shorturl){
        db.get(selquery,shorturl.toString(),function(err, row) {
            if(row && row.url){
                res.writeHead(302, {
                    'Location': row.url
                });
                res.end("");
            }else if(err){
                console.log(err);
            }
        });
    }else{
        var query = url_parts.query;
        if(query.url && url.parse(query.url)){
            var shasum = crypto.createHash('sha512');
            shasum.update(query.url);
            var short = shasum.digest('hex');
            short = short.substring(0,6);
            db.get(selquery,short,function(err, row) {
                if(!err && !row){
                    db.run("INSERT INTO urls (url,short) VALUES (?1,?2)",query.url,short);
                }
                if(row && row.url !== query.url){
                    res.end("Sorry there was a hash collision in the Database.");
                }else{
                    var u = url.parse("http://" + req.url + short);
                    if(is_local)
                        u = url.parse("http://"+is_local + short);
                    res.end('<a href="/'+short+'">'+u.href+'</a>');
                }
            });
        }else{
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=UTF-8'
            });
            res.end('\
                <html>\
                    <head>\
                        <link rel="icon" type="image/x-icon" href="/favicon.ico" />\
                    </head>\
                    <body></body>\
                    <form method="GET" action="/">\
                        <input type="text" name="url" /> <br/>\n\
                        <button>Shorten!</button>\
                    </form>\n\
                </html>');
        }
    }
    
}).listen(PORT, "");
