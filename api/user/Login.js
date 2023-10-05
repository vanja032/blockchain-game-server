const { Config } = require("../../config");
const crypto = require('crypto');

/**
 * @param {string} username
 * @param {string} password
 * @param {string} security_key
 * @returns {Promise<any>}
 */
const Login = async (username, password, security_key) => {
    try {
        if (!(username && password && security_key === Config.Config.SECURITY_KEY)) {
            throw new Error("Internal server error");
        }

        const user_data = await Config.Rpc.get_table_rows({
            code: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
            table: "users",
            scope: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
            index_position: 2,
            key_type: "name",
            lower_bound: `${username}`,
            upper_bound: `${username}`,
            limit: 1,
            json: true
        });

        if (user_data) {
            const sha256 = crypto.createHash('sha256');
            sha256.update(password);
            const password_has = sha256.digest('hex');
            if (user_data.rows[0].password === password_has) {
                return user_data;
            }
        }
        return null;
    }
    catch (error) {
        return null;
    }
};

module.exports = Login;