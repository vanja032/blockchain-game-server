const { Config } = require("../../config");
const crypto = require('crypto');

/**
 * @param {string} username
 * @param {string} password
 * @param {number} score
 * @param {string} security_key
 * @returns {Promise<any>}
 */
const SetScore = async (username, password, score, security_key) => {
    try {
        if (!(username && password && score && security_key === Config.Config.SECURITY_KEY)) {
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
                let data = { username, score };
                const result1 = await Config.RpcApi.transact({
                    actions: [{
                        account: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                        name: "inserts",
                        authorization: [{
                            actor: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                            permission: "active",
                        }],
                        data: data
                    }]
                });
                try {
                    data = { user_id: user_data.rows[0].user_id, score };
                    const result2 = await Config.RpcApi.transact({
                        actions: [{
                            account: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                            name: "updatem",
                            authorization: [{
                                actor: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                                permission: "active",
                            }],
                            data: data
                        }]
                    });
                }
                catch (error) { }
                const result3 = await Config.RpcApi.transact({
                    actions: [{
                        account: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                        name: "inc",
                        authorization: [{
                            actor: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
                            permission: "active",
                        }],
                        data: {}
                    }]
                });
                return true;
            }
        }
        return false;
    }
    catch (error) {
        return false;
    }
};

module.exports = SetScore;