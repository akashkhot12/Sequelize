const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
