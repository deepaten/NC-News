const db = require("../db/connection")

exports.fetchUsers=()=>
{
    return db.query(`SELECT username, COALESCE(user, '') name,avatar_url FROM users`)
        .then(({rows})=>{
           if (rows.length === 0)
           {
            return Promise.reject({status: 404, msg: "No users found."})
           }
           return rows;
        })
}