const db = require("../db/connection.js")


exports.fetchTopics=(request, response)=>{
    return db.query('SELECT slug, description FROM topics')
    .then(({rows})=>{
        return rows;
    })

}