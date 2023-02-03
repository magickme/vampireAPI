const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require("pg");

const app = express();

const port = process.env.NODE_PORT || 3000;

const pool = new pg.Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.on('connect', () => {
  console.log(`Connected to ${DB_DATABASE}`);
});

module.exports = pool;