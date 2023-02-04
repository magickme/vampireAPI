const { Client, Pool } = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.post('/api/resource', (req, res) => {
  const data = req.body;
  const queryString = `INSERT INTO north_america_kindred (name, clan, sect, title, gen, sire, secrets, city, state, orig_city, orig_state, orig_country, source, embrace) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
  const values = [data.clan, data.name, data.city];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

app.get('/api/resource', (req, res) => {
  pool.query('SELECT * FROM north_america_kindred LIMIT 10', (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result.rows);
  });
});

app.put('/api/resource/:id', (req, res) => {
  const data = req.body;
  const queryString = `UPDATE north_america_kindred SET clan = $1, name = $2, city = $3 WHERE name = $4`;
  const values = [data.clan, data.name, data.city, req.params.id];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

app.delete('/api/resource/:id', (req, res) => {
  const queryString = `DELETE FROM north_america_kindred WHERE name = $1`;
  const values = [req.params.id];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});