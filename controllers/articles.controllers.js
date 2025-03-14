//const { articleData } = require("../db/data/test-data")
const {fetchArticlesById,
        updateArticlesById,
        fetchArticles} = require("../models/articles.models")


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

exports.getArticles = (request, response, next)=>{

    fetchArticles()
    .then((articles)=>{
        response.status(200).send({articles: articles})
    })
    .catch((error)=>{
        next(error)
    })
}

exports.patchArticlesById= (request,response, next)=>{
const {article_id} = request.params
const {inc_votes} = request.body;

if (Number.isInteger(Number(article_id)) === false)
{
   response.status(400).send({msg:"Invalid article_id sent."})
}

if (!(inc_votes) || (typeof inc_votes != "number"))
{
    response.status(400).send({msg:"Bad request sent with either No details or incorrect details."})
}

    updateArticlesById(article_id,inc_votes)
    .then((article)=>{
        response.status(200).send({article: article})
    })
    .catch((error)=>{
        next(error)
    })

}