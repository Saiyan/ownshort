
//npm install assert
var ownshort = require('../ownshort');
var config = require('../config');
var assert = require('assert');
var http = require('http');
var https = require('https');

describe('Server started', function () {
    it('should return 200', function (done) {
        if(config.http.enabled){
            http.get('http://localhost:'+config.http.port, function (res) {
                assert.equal(200, res.statusCode);
                done();
            });
        }
        if(config.https.enabled){
            https.request({
                host: 'localhost', 
                port: config.https.port,
                path: '/',
                method: 'GET',
                rejectUnauthorized: false,
                requestCert: true,
                agent: false
            },function (res) {
                assert.equal(200, res.statusCode);
                done();
            });
        }
      });
});

describe('Url Request', function () {
    it('should contain 2ab8f4', function (done) {
        var callback = function (res) {
            var str = "";
            res.on('data', function (chunk) {
                str += chunk;
            });
            res.on('end', function () {
                assert.ok(str.indexOf("2ab8f4"));
                done();
            });
        };
        if(config.http.enabled){
            http.get('http://localhost:'+config.http.port+'/url?github.com', callback);
        }else if(config.https.enabled){
            https.get('https://localhost:'+config.http.port+'/url?github.com', callback);
        }
      });
});
