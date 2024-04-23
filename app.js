const express = require("express");
const app = express.app();
const { sequelize } = require("./models");
const serverPrefix = "/api-server";
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log("http://localhost:8080");
        console.log("http://13.124.54.214/");
    });
});
