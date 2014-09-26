
var config = {
    //Settings for the HTTP server
    http:{
        enabled: true,
        port: 9080
    },
    //Settings for the HTTPS server
    https: {
        enabled: true,
        port: 9081,
        keyfile: "./ssl/server.key",
        certfile: "./ssl/server.crt"
    },
    //Database settings
    db:{
        filename:"urls.sqlite3"
    },
    //Frontend settings
    frontend:{
        theme: {
            //name of the folder for the active theme (e.g. "simple" loads themes/simple/)
            active: 'simple',
             
            //If this option is enabled the server will load the theme only on startup.
            //This could be handy if you are developing your own theme and dont want to restart the server everytime you make a change.
            loadonce: true
        },
        //If the Frontend is disabled you can only use http://SERVER/?url=LINK and the short links
        disabled: false
    }
};

module.exports = config;

