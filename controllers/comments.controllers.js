const express = require("express");
const app = express();

const {fetchCommentsByArticleID,
    insertCommentsByArticleId} = require("../models/comments.models")
const {checkArticleIdExists} = require("../models/articles.models");
const comments = require("../db/data/test-data/comments");

exports.getCommentsByArticleID= (request, response, next)=>{
    const {article_id} = request.params;

    const promises = [fetchCommentsByArticleID(article_id)]
    promises.push(checkArticleIdExists(article_id))

    Promise.all(promises)
        .then((resolvedpromises)=>{
            response.status(200).send({comments: resolvedpromises[0]})
        })
        .catch((error)=>{
            next(error)
        })
}

exports.postCommentsByArticleId = (request, response,next)=>{

    const {article_id} = request.params;
    const {username} = request.body;
    const {body} = request.body;

    if (!(username)|| !(body))
    {
        response.status(400).send({msg:"Bad request sent with no details."})
    }
    
    const promises = [insertCommentsByArticleId(article_id,username,body)]
    promises.push(checkArticleIdExists(article_id))

    Promise.all(promises)
        .then((resolvedpromises)=>{
            response.status(200).send({comment: resolvedpromises[0]})
        })
        .catch((error)=>{  
            next(error)
        })

}