const {fetchTopics} = require("../models/topics.models.js")

exports.getTopics = (request,response,next)=>
{
  fetchTopics()
  .then((topics)=>{
    response.status(200).send({topics})
  })
  .catch((err)=>{
    next(err);
  })
}


