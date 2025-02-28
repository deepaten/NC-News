const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  //console.log( created_at, "  insidle--------------")
  return { created_at: new Date(created_at), ...otherProperties };
};



