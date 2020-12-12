const http = require("http");
const fs = require("fs");

const getTimestamp = date => ({
    unix: date.getTime(),
    utc: date.toUTCString()
});

/* provide instructions on how to ue the timestamp microservice once the
root route is hit */
const requestHandler = (req, res) => {
    if (req.url === "/") {
        /* readFile asynchronously reads the first argument filepath using
         provided encoding "utf8" then executes callback function */
        fs.readFile("views/index.html", "utf8", (err, html) => {
            if (err) throw err;

            /* writeHead to set the HTTP response code. 
            Status code as first argument, object response headers as second.
            'text/html' ensures browser interprets contents as HTML */
            res.writeHead(200, {"Content-Type": "text/html"});

            /* end() method sends contents of index.html to the browser and 
            signals end of the server response */
            res.end(html);
        });

        /* else if statement checks if the request URL starts with "/api/timestamp" 
        If true, split() method splits the URL into two and grabs the date part and assigns
        it to dateString */
    } else if (req.url.startsWith("/api/timestamp")) {
        const dateString = req.url.split("/api/timestamp/")[1];
        let timestamp;

        /* if dateString is undefined or empty treat it as if current date was requested */
        if(dateString === undefined || dateString.trim() === "") {
            timestamp = getTimestamp(new Date());

            /* check if date is a unix timestamp or ISO-8601 date string */
        } else {
            const date = !isNaN(dateString)
            ? new Date(parseInt(dateString))
            : new Date(dateString);

            /* check if date object stored in "date" is valid.
            If true, get timestamp
            If false, return error */
            if (!isNaN(date.getTime())) {
                timestamp = getTimestamp(date);
            } else {
                timestamp = {
                    error: "invalid date"
                };
            }
        }
        /* send contents of "timestamp" to the browser, set Content-Type to JSON */
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(timestamp));
    } else {
        fs.readFile("views/404.html", (err, html) => {
            if (err) throw err;

            res.writeHead(404, {"Content-Type": "text/html"});
            res.end(html);
        });
    }
};

/* utilize createServer to crate new instance of HTTP server, 
stored in server variable */
const server = http.createServer(requestHandler);

/* starts the server listening for incoming connections on PORT env variable 
or 4100 if nothing there*/
server.listen(process.env.PORT || 4100, err => {
    if(err) throw err;

    console.log(`Server running on PORT ${server.address().port}`);
});