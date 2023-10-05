const { Config } = require("../../config");

/**
 * @returns {Promise<any>}
 */
const GetQuestions = async () => {
    try {
        const questions_data = await Config.Rpc.get_table_rows({
            code: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
            table: "questions",
            scope: `${Config.Config.BLOCKCHAIN_ACCOUNT}`,
            json: true
        });
        return questions_data;
    }
    catch (error) {
        return null;
    }
};

module.exports = GetQuestions;