const { Config } = require("./config");
const App = require("./app");

if (Config.Config.PROTOCOL === "https") {
    const fs = require("fs");
    const ServerOptions = {
        cert: fs.readFileSync(`${Config.Config.SSL_CERT}`),
        key: fs.readFileSync(`${Config.Config.SSL_KEY}`)
    };

    const https = require("https");
    const server = https.createServer(ServerOptions, App);
    server.listen(Config.Config.SERVER_PORT, Config.Config.SERVER_HOST, () => {
        if (Config.Config.LOGGING) console.log(`Server started {${Config.Config.SERVER_HOST}:${Config.Config.SERVER_PORT}}`)
    });
}
else {
    const http = require("http");
    const server = http.createServer(App);
    server.listen(Config.Config.SERVER_PORT, Config.Config.SERVER_HOST, () => {
        if (Config.Config.LOGGING) console.log(`Server started {${Config.Config.SERVER_HOST}:${Config.Config.SERVER_PORT}}`)
    });
}