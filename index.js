import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

//express app
const app = express();
const port = 3000;

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//establish db connection
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todo_list",
  password: "2930",
  port: 5432,
});
db.connect();

app.get("/", async (req, res) => {
  const items = await db.query(
    "SELECT * FROM todo_items"
  );

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items.rows,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query(
      "INSERT INTO todo_items (title) VALUES ($1)",
      [item]
    );
  } catch (err) {
    console.log(err);
  }

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const title = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query(
      "UPDATE todo_items SET title = $2 WHERE id = $1",
      [id, title]
    );
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query(
      "DELETE FROM todo_items WHERE id = $1",
      [id]
    );
  } catch (err) {
    console.log(err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
