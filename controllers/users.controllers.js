const { response } = require("../app")
const {fetchUsers} = require("../models/users.models.js")


exports.getUsers = (request, response, next) =>{

    fetchUsers()
    .then((users)=>{
        response.status(200).send({users: users})
    })
    .catch((error)=>{
        next(error)
    })
}