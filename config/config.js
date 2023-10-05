const { Api, JsonRpc, RpcError, JsSignatureProvider } = require("ineryjs");
require("dotenv").config({ path: "./.env" });

const Rpc = new JsonRpc(process.env.BLOCKCHAIN_URL);
const signature = new JsSignatureProvider([process.env.PRIVATE_KEY]);
const RpcApi = new Api({ rpc: Rpc, signatureProvider: signature });

const Config = {
    SERVER_HOST: process.env.SERVER_HOST || "0.0.0.0",
    SERVER_PORT: process.env.SERVER_PORT || "8080",
    PROTOCOL: process.env.PROTOCOL || "http",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
    ALLOWED_METHODS: process.env.ALLOWED_METHODS ? process.env.ALLOWED_METHODS.split(",") : "*",
    SSL_CERT: process.env.SSL_CERT,
    SSL_KEY: process.env.SSL_KEY,
    LOGGING: process.env.LOGGING ? Boolean(process.env.LOGGING) : false,
    BLOCKCHAIN_ACCOUNT: process.env.ACCOUNT || "quiz",
    SECURITY_KEY: process.env.SECURITY_KEY || "some_key"
};

module.exports = {
    Rpc,
    RpcApi,
    Config
};