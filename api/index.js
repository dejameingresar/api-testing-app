const express = require("express");
const app = express();
app.use(express.json());

let items = [
  { id: 1, name: "alpha" },
  { id: 2, name: "beta" }
];

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/items", (req, res) => res.json(items));

app.get("/api/items/:id", (req, res) => {
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "not found" });
  res.json(item);
});

app.post("/api/items", (req, res) => {
  const { name } = req.body || {};
  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "name is required" });
  }
  const item = { id: Date.now(), name };
  items.push(item);
  res.status(201).json(item);
});

app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = items.length;
  items = items.filter((i) => i.id !== id);
  if (items.length === before) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`API on :${port}`));
}

module.exports = app;
