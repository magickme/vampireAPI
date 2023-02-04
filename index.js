const { Client, Pool } = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const connectDb = async () => {
  try {
    const pool = new Pool({
      user: process.env.DB_USERNAME,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
    })

    await pool.connect()
    const res = await pool.query('SELECT * FROM north_america_kindred WHERE clan = \'Tremere\' LIMIT 10')
    console.log(res)
    await pool.end()
  } catch (error) {
    console.log(error)
  }
}

connectDb()