const express = require("express");
const app = express();

const {fetchCommentsByArticleID, insertCommentsByArticleId,
    removeCommentById} = require("../models/comments.models")
const {checkArticleIdExists} = require("../models/articles.models");
const comments = require("../db/data/test-data/comments");
const { errorMonitor } = require("supertest/lib/test");



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

    const promises = [checkArticleIdExists(article_id)]
    
    promises.push(insertCommentsByArticleId(article_id,username,body))

    Promise.all(promises)
        .then((resolvedpromises)=>{
            response.status(200).send({comment: resolvedpromises[1]})
        })
        .catch((error)=>{  
            next(error)

        })

}

exports.deleteCommentById = (request, response, next)=>{
    const {comment_id} = request.params;
    if (typeof Number(comment_id) != "number")
    {
        response.status(400).send({msg:"Bad request sent for the comment_id."})
    }

    removeCommentById( comment_id)
    .then((rows)=>{

        response.status(204).send({})
    })
    .catch((error)=>{
        next(error)
    })
    
}