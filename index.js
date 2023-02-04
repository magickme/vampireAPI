const { Client } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = async () => {
  try {
    const client = new Client({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    })

    await client.connect()
    const res = await client.query('SELECT * FROM north_america_kindred WHERE clan = \'Tremere\' LIMIT 10')
    console.log(res)
    await client.end()
  } catch (error) {
    console.log(error)
  }
}

connectDb()