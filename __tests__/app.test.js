const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const data = require("../db/data/test-data");
const { string } = require("pg-format");
require('jest-sorted');


/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});


describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  
});

describe("GET /api/topics",()=>{
  test("200: Responds with an array of topic objects, each having properties slug and description",()=>{
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body})=>{       
        const topics = body.topics;
        expect(topics.length).toBe(3);
        
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String)})          
        });
      })
    })
  })

  //for testing missing endpoint
describe("GET /api/missingendpoint",()=>{
  test("404: Responds with error message for missing endpoint.",()=>{
    return request(app)
    .get("/api/missingendpoint")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Path not found.")
    })
  })
})

describe("GET /api/articles/:article_id",()=>{
  test("200: Responds with and article object that has author,title,article_id,body,topic,created_at,votes,article_img_url",()=>{
    return request(app)
    .get("/api/articles/3")
    .expect(200)
    .then(({body})=>{
      const article = body.article;      
      expect(article.article_id).toBe(3)
      expect(article).toMatchObject({
        author: expect.any(String),
        title: expect.any(String),
        article_id: expect.any(Number),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String)
      })
    })
  })


  test("404: Responds with articles not found for valid Id that does not exist in database.",()=>{
    return request(app)
    .get("/api/articles/18")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Articles not found for the Id 18.")
    })
  })

  test("400: Responds with Bad request for sending invalid data.",()=>{
    return request(app)
    .get("/api/articles/invalidid")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request sent, please send valid Article Id.")
    })
  })
})

describe("GET /api/articles",()=>{
  test("200: Responds with articles array of objects with properties author,title,article_id,topic,created_at,votes,article_img_url and comment_count which is the total count of all the comments with this article_id.",()=>
  {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body})=>{
      const articles = body.articles
        //to test sort order
        expect(articles).toBeSortedBy('created_at', { descending: true });
        //to test if returns records
        expect(articles.length).toBe(13)

        articles.forEach((article)=>{
        //for checking comment count for article id
              if (article.article_id === 5)
              {
                expect(article.comment_count).toBe(2);
              }
      
              expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number) })
            })
      })
})
})

describe("GET /api/articles/:articles_id/comments",()=>{
  test("200: Responds with all comments for an article Id with most recent comments first.",()=>{
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({body})=>{
      const comments = body.comments
      expect(comments.length).toBe(11)
      expect(comments).toBeSortedBy('created_at', { descending: true });

      comments.forEach((comment)=>{
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number)
        })
      })
    })
  })

  test("404: Responds with comments not found for valid Id that does not exist in the database.",()=>
  {
    return request(app)
    .get("/api/articles/18/comments")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Comments not found for the article_id 18.")
    })
  })

  test("400: Responds with Bad request for sending invalid data.",()=>{
    return request(app)
    .get("/api/articles/invalidid/comments")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request sent, please send valid Article Id.")
    })
  })
})