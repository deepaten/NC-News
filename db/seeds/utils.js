const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createArticleLookup=(insertedRows)=>{
  if ( insertedRows.length === 0)
  {
    return {};}

  let articleLookup = {}
  for (let i=0; i < insertedRows.length; i++)
  {
    articleLookup[insertedRows[i].title]= insertedRows[i].article_id;
  }
  return articleLookup;
 }

 exports.formatComments=(newComments, articleLookup)=>{
    let arrCommentObject =[];

    if (articleLookup === undefined){
        return arrArtistObject;
    }

    newComments.forEach(comment => {
      let outputComment = {};
        for (const article in articleLookup)
        {
          if ( article === comment.article_title)
          {
            outputComment.article_id = articleLookup[article];
          }
        }
        outputComment.body = comment.body;
        outputComment.votes = comment.votes;
        outputComment.author = comment.author;
        outputComment.created_at = comment.created_at;
        arrCommentObject.push(outputComment);    
      });
    return arrCommentObject;
}

