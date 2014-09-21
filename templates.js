
var templates = {
    frame: '<html>\
                <head>\
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />\n\
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">\n\
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">\n\
                <link rel="stylesheet" href="layout.css">\n\
                </head>\n\
                <body>\n\
                    <div class="container">\
                        <% shortenForm %>\n\
                    </div>\
                    <script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>\n\
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>\
                    <script src="frontend.js"></script>\
                </body>\
            </html>',
    shortenForm:
            '<form method="GET" class="navbar-form navbar-left shorten-form"  action="/">\n\
                <div class="form-group">\
                    <input type="text"  class="form-control" name="url" /> <br/>\n\
                </div>\
                <button class="btn btn-default">Shorten!</button>\n\
                <img class="ajax-indicator" src="loader.gif"/>\n\
                <div class="form-group">\n\
                    <a href="" class="short-url-output"></a>\
                </div>\
            </form>'
}

module.exports = templates;