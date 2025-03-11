const {fetchTopics} = require("../models/topics.models.js")

exports.getTopics = (request,response,next)=>
{
  console.log(" get topics")
  fetchTopics()
  .then((topics)=>{
    response.status(200).send({topics})
  })
  .catch((err)=>{
    console.log(err, " --------hrere")
    next(err);
  })
}


