const express = require("express");
const auth = require("./routes/auth");

const server = express();

server.use(express.json());

server.use("/auth", auth);

server.get("/", (req, res) => {
  res.send("data feom JWT");
});

server.listen(5000, () => {
  console.log("Running...");
});
