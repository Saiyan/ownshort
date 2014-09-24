#ownshort

This is ownshort.

##Requirements
[node-sqlite3](https://github.com/mapbox/node-sqlite3)
> The sqlite3 module works with Node.js v0.10.x or v0.11.x (though only v0.11.13 and above).

##Installation

    git clone https://github.com/Saiyan/ownshort.git
    cd ownshort
    npm install sqlite3

##Usage

    nodejs /path/to/ownshort/ownshort.js

Now you can access the frontend under http://localhost:9080

To get a shorturl for specific URL call: http://localhost:9080/?url=URL
This returns the shorturl in plain text.

The frontend uses this method to get the shorturl via AJAX call can be disabled in the config.js.


##Options
Adjust the config.js file to your needs
