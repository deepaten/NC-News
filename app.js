const express = require("express");
const app = express();
const endpoints = require("./endpoints.json")
const getApi = require("./controllers/api.controllers")
const {getTopics} = require("./controllers/topics.controllers")
const {getArticlesById, getArticles} = require("./controllers/articles.controllers")


app.get('/api', getApi);

app.get('/api/topics',getTopics)

app.get('/api/articles/:article_id', getArticlesById)

app.get('/api/articles', getArticles)


//end point error
app.all('/*', (request, response,next) => {
    response.status(404)
    .send({msg: "Path not found."})
})

//custom error
app.use(( error, request , response, next)=>{
    if(error.status && error.msg)  {
        response.status(error.status).send({msg: error.msg})
    } else {
        next(error)
    }
});

//db error
app.use((error, request, response, next)=>{
    if(error.code === "22P02") {
        response.status(400)
        .send({msg: "Bad request sent, please send valid Article Id."})
    }
})

//all other errors
app.use((err, req, res )=>{
    res.status(500).send({msg: "Internal server error."})
})


module.exports = app;