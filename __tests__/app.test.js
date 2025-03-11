const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const data = require("../db/data/test-data");
const { string } = require("pg-format");


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
       expect(articles[0].article_id).toBe(3)
       expect(articles[0].created_at).toBe( "2020-11-03T09:12:00.000Z")
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
          comment_count: expect.any(Number)
      })
    })
  })
})
})