const express = require("express");
const app = express();
require("dotenv/config");
const { PORT } = process.env;
const port = PORT;
const cors = require("cors");
const morgan = require("morgan");
const database = require("./config/database");
const userRoute = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
database();

app.use("/api/user", userRoute);

app.all("/", (req, res) => {
  return res.status(200).json({ message: "API is up and running" });
});

app.all("*", (req, res) => {
  return res.status(500).json({ message: "Are you lost? Route doesn't exist" });
});

app.listen(port, () => {
  console.log(`Listening to http://localhost${port}`, port);
});
