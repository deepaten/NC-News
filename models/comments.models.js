const db = require("../db/connection")
const convertTimestampToDate = require("../db/seeds/utils")

exports.fetchCommentsByArticleID= (article_id)=>{

    return db.query(`SELECT comment_id, votes, created_at, author, body, article_id
                        FROM comments
                        WHERE article_id = $1 
                        ORDER BY created_at DESC`,[article_id])
                        
            .then(({rows})=>{
               return rows
         
            })

}


exports.insertCommentsByArticleId=(article_id,username,body)=>{
    const currentDt = new Date;
    
    return db.query(`INSERT INTO comments
                (article_id, body, votes, author, created_at)
                VALUES($1,$2,$3,$4,$5)
                RETURNING * `,[article_id,body,0,username,currentDt])
                .then(({rows})=>{
                    if (rows.length === 0){
                        return Promise.reject({status: 404, msg: `Comments not inserted in the table for the article_id ${article_id}.`});
                    }                    
                    return rows[0];
                })
    
}


exports.removeCommentById = (comment_id)=>{

    return db.query(`DELETE FROM comments
                    WHERE comment_id = $1
                    RETURNING * `, [comment_id])
                .then(({rows})=>{
                    
                    if (rows.length === 0)
                    {
                        return Promise.reject({status: 404, msg: `Comment_id not found.`}) 
                    }
                    return rows[0];
                })

}