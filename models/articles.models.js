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

exports.checkArticleIdExists=(article_id)=>
    {
        return db.query(`SELECT * FROM articles
                WHERE article_id = $1`,[article_id])
                .then(({rows})=>{
                    if (rows.length === 0){                        
                          return Promise.reject({status: 404, msg: `Comments not found for the article_id ${article_id}.`});
                    }
                })
    }

exports.fetchArticles= () => {

    return db.query(`SELECT articles.author, articles.title, articles.article_id, 
            articles.topic,articles.created_at, articles.votes, articles.article_img_url, 
            count(comments.comment_id)::int as comment_count
            FROM articles 
            LEFT JOIN comments 
            ON articles.article_id = comments.article_id
            GROUP BY articles.author, articles.title, articles.article_id, articles.topic,
            articles.created_at, articles.votes, articles.article_img_url 
            ORDER BY articles.created_at DESC `)
            .then(({rows})=>{
                
                if (rows.length === 0){
                    return Promise.reject({status: 404, msg: `Articles not found.`});
                }
                return rows;
            })
}
