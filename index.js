// Attempt at now wrapping the pg call in an Express server with endpoints

const { Client, Pool } = require("pg")
const dotenv = require("dotenv")
dotenv.config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 8080
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const pool = new Pool({
  user: 'postgres',
  host: '/cloudsql/ultraculture-cloud:us-central1:schreck-net',
  database: 'postgres',
  password: 'chaos23',
  port: 5432
})

const connectDb = async () => {
  try {
    await pool.connect()
  } catch (error) {
    console.log(error)
  }
}

// Signal that API is operational

app.get('/', (req, res) => {
  res.send('Vampire Prestation Interface up and running!');
});

// Create new Kindred

app.post('/vpi/write', (req, res) => {
  const data = req.body;
  const queryString = `INSERT INTO schrecknet (name, clan, sect, title, gen, sire, secrets, city, state, orig_city, orig_state, orig_country, source, embrace) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
  const values = [data.name, data.clan, data.sect, data.title, data.gen, data.sire, data.secrets, data.city, data.state, data.orig_city, data.orig_state, data.orig_country, data.source, data.embrace];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

// Read all Kindred

app.get('/vpi/read', (req, res) => {
  pool.query('SELECT * FROM schrecknet', (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result.rows);
  });
});

// Read specific Kindred by name

app.get('/vpi/read/:name', (req, res) => {
  const queryString = `SELECT * FROM schrecknet WHERE name = $1`;
  const values = [req.params.name];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result.rows);
  });
});

// Update a Kindred

app.put('/vpi/update/:name', (req, res) => {
  const data = req.body;
  const queryString = `UPDATE schrecknet SET name = $1, clan = $2, sect = $3, title = $4, gen = $5, sire = $6, secrets = $7, city = $8, state = $9, orig_city = $10, orig_state = $11, orig_country = $12, source = $13, embrace = $14 WHERE name = $1`;
  const values = [data.name, data.clan, data.sect, data.title, data.gen, data.sire, data.secrets, data.city, data.state, data.orig_city, data.orig_country, data.source, data.embrace, req.params.name];
  pool.query(queryString, values, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
    }
    res.status(200).json(result);
  });
});

// Delete a Kindred

app.delete('/vpi/delete/:name', (req, res) => {
  const queryString = `DELETE FROM schrecknet WHERE name = $1`;
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