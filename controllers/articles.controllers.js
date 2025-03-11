//const { articleData } = require("../db/data/test-data")
const {fetchArticlesById} = require("../models/articles.models")

exports.getArticlesById = (request, response, next)=>
{
    const {article_id} = request.params;
    fetchArticlesById(article_id)
    .then((article)=>{
        response.status(200).send({article: article})
    })
    .catch((error)=>{
        next(error)
    })


}