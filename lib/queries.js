
var queries = {
    create: "CREATE TABLE IF NOT EXISTS urls  (id INTEGER PRIMARY KEY,url TEXT, short TEXT)",
    selectByShort: "SELECT * FROM urls WHERE short = ?",
    insertUrl:"INSERT INTO urls (url,short) VALUES (?1,?2)"
};

module.exports = queries;
