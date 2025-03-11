const db = require("../db/connection")

exports.fetchArticlesById= (articleId)=>{

    return db.query( `SELECT author, title, article_id, body, topic,
                    created_at, votes,article_img_url FROM articles
                    WHERE article_id = $1 `,[articleId])
                    .then(({rows})=>{
                        if(rows.length === 0) {
                            return Promise.reject({status: 404, msg: `Articles not found for the Id ${articleId}.`});
                        }
                        return rows[0];

                    })
                
    
}
