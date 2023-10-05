const { Config } = require("../../config");
const crypto = require('crypto');

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} security_key
 * @returns {Promise<any>}
 */
const Signup = async (username, email, password, security_key) => {
    try {
        if (!(username && email && password && security_key === Config.Config.SECURITY_KEY)) {
            throw new Error("Internal server error");
        }

        const sha256 = crypto.createHash('sha256');
        sha256.update(password);
        const password_hash = sha256.digest('hex');

        const data = {
            username, email, password: password_hash
        };

        const result = await Config.RpcApi.transact({
            actions: [{
                account: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                name: "insertu",
                authorization: [{
                    actor: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                    permission: "active",
                }],
                data: data
            }]
        });

        return true;
    }
    catch (error) {
        return false;
    }
};

module.exports = Signup;