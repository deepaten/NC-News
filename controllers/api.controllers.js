const endpoints = require("../endpoints.json")

function getApi (request, response)
{
    response.status(200).send({endpoints: endpoints})
}


module.exports = getApi;