import { config } from "dotenv";

config();

export default {
    port: process.env.PORT || 4000,
    dbhost: process.env.DB_HOST || 'localhost',
    database: process.env.DATABASE || 'brimoon',
    dbport: process.env.DB_PORT || 3306,
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || ''
};
