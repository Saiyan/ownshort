
var config = {
    http:{
        enabled: true,
        port: 9080
    },
    https: {
        enabled: false,
        port: 9081,
        keyfile: "../temp/server.key",
        certfile: "../temp/server.crt"
    },
    files:{
        favicon: 'favicon.ico'
    },
    db:{
        filename:"urls.sqlite3"
    },
    frontend:{
        theme: {
            active: 'simple',
            loadonce: true
        },
        disabled: false
    }
};

module.exports = config;

