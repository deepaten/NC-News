const {fetchCommentsByArticleID} = require("../models/comments.models")


exports.getCommentsByArticleID= (request, response, next)=>{
const {article_id} = request.params;

fetchCommentsByArticleID(article_id)
.then((comments)=>{
    response.status(200).send({comments});
})
.catch((error)=>{
    next(error);
})

}