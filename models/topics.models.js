const db = require("../db/connection.js")


exports.fetchTopics=(request, response)=>{

    return db.query('SELECT slug, description FROM topics')
    .then(({rows})=>{
        console.log(rows)
        return rows;
    })

}