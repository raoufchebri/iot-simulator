const cassandra = require('cassandra-driver');
require('dotenv').config();

const { NODE_1, USERNAME, PASSWORD, DATA_CENTER, KEYSPACE } = process.env;

function getClient() {
    const client = new cassandra.Client({
        contactPoints: [NODE_1],
        authProvider: new cassandra.auth.PlainTextAuthProvider(
            USERNAME,
            PASSWORD
        ),
        localDataCenter: DATA_CENTER,
        keyspace: KEYSPACE,
    });

    return client;
}

function insertQuery(table) {
    const tableName = table.tableName;
    const values = table.columns.map(() => '?').join(', ');
    const fields = table.columns.join(', ');
    return `INSERT INTO ${tableName} (${fields}) VALUES (${values})`;
}

module.exports = { getClient, insertQuery };
