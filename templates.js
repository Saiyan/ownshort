
var templates = {
    frame: '<html>\
                <head>\
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />\
            </head>\
            <body>\
                <% shortenForm %>\
            </body>\
        </html>',
    shortenForm:
            '<form method="GET" action="/">\n\
                <input type="text" name="url" /> <br/>\n\
                <button>Shorten!</button>\n\
            </form>\n'
}

module.exports = templates;