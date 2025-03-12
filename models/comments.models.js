const db = require("../db/connection")

exports.fetchCommentsByArticleID= (article_id)=>{

    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id
                        FROM comments
                        WHERE article_id = $1 
                        ORDER BY created_at DESC`,[article_id])
                        
            .then(({rows})=>{
                if (rows.length === 0){
                    return Promise.reject({status: 404, msg: `Comments not found for the article_id ${article_id}.`});
                }
                return rows
                
            })
}