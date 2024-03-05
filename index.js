const pg = require("pg");
const express = require("express");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_notes_db"
);
const app = express();

// parse the body into JS Objects
app.use(express.json());
// Log the requests as they come in
app.use(require("morgan")("dev"));

//App Routes
// Create Flavors
app.post("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `INSERT INTO flavors(name, is_favorite)
        VALUES ($1, $2)
        RETURNING *`;
    const result = await client.query(SQL, [
      req.body.name,
      req.body.isFavorite,
    ]);
    res.send(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});
// Read Flavors
app.get("/api/flavors", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * from flavors;
      `;
    const result = await client.query(SQL);
    res.send(result.rows);
  } catch (ex) {
    next(ex);
  }
});
// Read Single Flavor
app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    const SQL = `
        SELECT * from flavors
        WHERE id=$1;
      `;
    const result = await client.query(SQL, [req.params.id]);
    res.send(result.rows);
  } catch (ex) {
    next(ex);
  }
});
// Update Flavors
app.put("/api/flavors/:id", async (req, res, next) => {
  try {
    const SQL = `UPDATE flavors
        SET name = $1, is_favorite = $2, updated_at=now()
        WHERE id = $3 RETURNING *`;
    const result = await client.query(SQL, [
      req.body.name,
      req.body.isFavorite,
      req.params.id,
    ]);
    res.send(result.rows[0]);
  } catch (ex) {
    next(ex);
  }
});
// Delete Flavors
app.delete("/api/flavors/:id", async (req, res, next) => {
  try {
    const SQL = `
        DELETE FROM flavors
        WHERE id = $1;
      `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// create and run the express app
const init = async () => {
  await client.connect();
  console.log("connected to database");
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
  console.log("tables created");
  SQL = ` 
    INSERT INTO flavors(name) VALUES('chocolate');
    INSERT INTO flavors(name) VALUES('strawberry');
    INSERT INTO flavors(name) VALUES('butterpecan');
    `;
  await client.query(SQL);
  console.log("data seeded");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
