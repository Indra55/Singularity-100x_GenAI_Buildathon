require("dotenv").config()

const {Pool} = require("pg")

const isProduction = process.env.NODE_ENV === "production";

const connectionString = process.env.POSTGRES_URI;

const pool= new Pool({
    connectionString: isProduction? process.env.DATABASE_URL:connectionString
})

module.exports = pool