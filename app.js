const express = require("express");
const app = express();
const endpoints = require("./endpoints.json")
const getApi = require("./controllers/api.controllers")
const {getTopics} = require("./controllers/topics.controllers")


app.get('/api', getApi);

app.get('/api/topics',getTopics)



app.all('/*', (request, response,next) => {
    response.status(404)
    .send({msg: "Path not found."})
})

app.use((req, res, err )=>{
    response.status(500).send({msg: "Internal server error."})
})


module.exports = app;