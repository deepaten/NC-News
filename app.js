const express = require("express");
const app = express();
const endpoints = require("./endpoints.json")
const getApi = require("./controllers/api.controllers")


app.get('/api', getApi);


module.exports = app;