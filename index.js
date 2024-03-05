const pg = require('pg')
const express = require('express')
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/the_acme_notes_db')
const app = express()

// parse the body into JS Objects
app.use(express.json())
// Log the requests as they come in
app.use(require('morgan')('dev'))

//App Routes
// Create Flavors 
app.post('/api/flavors', async (req, res, next) => {});
// Read Flavors 
app.get('/api/flavors', async (req, res, next) => {});
// Read Single Flavor 
app.get('/api/flavors/:id', async (req, res, next) => {});
// Update Flavors 
app.put('/api/flavors/:id', async (req, res, next) => {});
// Delete Flavors 
app.delete('/api/flavors/:id', async (req, res, next) => {});

// create and run the express app
const init = async () => {
    await client.connect();
    console.log('connected to database');
    let SQL = `
    DROP TABLE IF EXISTS flavors;
    CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
    )
    `;
    await client.query(SQL);
    console.log('tables created');
    SQL = ` 
    INSERT INTO flavors(name) VALUES('chocolate');
    INSERT INTO flavors(name) VALUES('strawberry');
    INSERT INTO flavors(name) VALUES('butterpecan');
    `;
    await client.query(SQL);
    console.log('data seeded');
  };
  
  init();