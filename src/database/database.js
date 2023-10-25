import mysql from "promise-mysql";
import config from "./../config.js";

export const getConnection = mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.dbport
});
