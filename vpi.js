// Attempt at now wrapping the pg call in an Express server with endpoints

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
  } catch (error) {
    console.log(error)
  }
}

app.post('/vpi/write', (req, res) => {
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

app.get('/vpi/read', (req, res) => {
  pool.query('SELECT * FROM north_america_kindred LIMIT 10', (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result.rows);
  });
});

app.put('/vpi/update/:name', (req, res) => {
  const data = req.body;
  const queryString = `UPDATE north_america_kindred SET (name = $1, clan = $2, sect = $3, title = $4, gen = $5, sire = $6, secrets = $7, city = $8, state = $9, orig_city = $10, orig_state = $11, orig_country = $12, source = $13, embrace = $14) WHERE name = $1`;
  const values = [data.clan, data.sect, data.title, data.gen, data.sire, data.secrets, data.city, data.state, data.orig_city, data.orig_country, data.source, data.embrace, req.params.name];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

app.delete('/vpi/delete/:name', (req, res) => {
  const queryString = `DELETE FROM north_america_kindred WHERE name = $1`;
  const values = [req.params.name];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

app.listen(port, () => {
  connectDb;
  console.log(`Vampire Prestation Interface (SchreckNET) listening on port ${port}!`);
});