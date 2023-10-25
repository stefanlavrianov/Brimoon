import {createPool} from "mysql2/promise";
import config from "./../config.js";

export const getConnection = createPool({
    host: config.host,
    database: config.database,
    user: config.user,
    password: config.password,
    port: config.dbport
});
