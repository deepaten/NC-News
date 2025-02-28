const db = require("../connection")
const format = require('pg-format');
const convert = require("./utils.js");


const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query("DROP TABLE IF EXISTS comments") //<< dropping articles table
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS articles") //<< dropping comments table
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS topics") //<< dropping topics table
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS users") //<< dropping users table
  })
  .then(()=>{
    return db.query(`CREATE TABLE topics (
                    slug VARCHAR(300) PRIMARY KEY,
                    description VARCHAR(300),
                    img_url VARCHAR(1000));`)
  })
  .then(()=>{
    return db.query(`CREATE TABLE users (
                    username VARCHAR(300) PRIMARY KEY,
                    name VARCHAR(300),
                    avatar_url VARCHAR(1000));`)
    })
  .then(()=>{
    return db.query(`CREATE TABLE articles (
                  article_id SERIAL PRIMARY KEY,
                  title VARCHAR (300),
                  topic VARCHAR(300) REFERENCES topics(slug),
                  author VARCHAR(300) REFERENCES users(username),
                  body TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  votes INT DEFAULT 0,
                  article_img_url VARCHAR(1000));`)
  })
  .then(()=>{
    return db.query(`CREATE TABLE comments(
                  comment_id SERIAL PRIMARY KEY,
                  article_id INT REFERENCES articles ( article_id),
                  body TEXT,
                  votes INT DEFAULT 0,
                  author VARCHAR(300) REFERENCES users(username),
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`)
  })
  .then(()=>{
    //create a formatted string to pass to format function
    const formattedInsertValues = topicData.map((topic)=>{
      return [topic.slug, topic.description, topic.img_url];
    });

    //make a call to format with vlues in topics
    const insertQuery = format(`INSERT INTO topics
                      (slug, description, img_url)
                      VALUES
                      %L
                      RETURNING *;`,
                    formattedInsertValues )
    return db.query(insertQuery);
  })
  .then(()=>{
    //formatted string for usersdata
    const formattedInsertValues = userData.map((user)=>{
      return [user.username, user.user, user.avatar_url];
    })
    //make a call to format with values to insert in users
    const insertQuery = format(`INSERT INTO users
                      (username, name, avatar_url)
                      VALUES
                      %L
                      RETURNING *;`,
                      formattedInsertValues )
    return db.query(insertQuery);
  })
  .then(()=>
  {
    //formatted string for articles data
      const formattedInsertValues = articleData.map((article)=>{
        const timestampConverted = convert.convertTimestampToDate(article.created_at);
        //console.log(timestampConverted,article.created_at, " >>>>AFTER CONVERTSION")
      return [article.title, article.topic, article.author, article.body,timestampConverted, article.votes, article.article_img_url];
    })
    //make a call to format with values to insert in articles
    const insertQuery = format(`INSERT INTO articles
                      (title, topic, author, body, created_at, votes, article_img_url )
                      VALUES
                      %L
                      RETURNING *;`,
                      formattedInsertValues )
   // return db.query(insertQuery);
  })
  .then((rows)=>{
    console.log(rows, "after article insert")
  })
};
module.exports = seed;
