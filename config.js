
var config = {
    http:{
        enabled: false,
        port: 9080
    },
    https: {
        enabled: true,
        port: 9081,
        keyfile: "",
        certfile: ""
    },
    files:{
        favicon: 'favicon.ico'
    },
    db:{
        filename:"urls.sqlite3"
    }
};

module.exports = config;

