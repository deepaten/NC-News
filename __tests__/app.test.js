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
      expect(body.msg).toBe("Bad request sent.")
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
        expect(comment.article_id).toBe(1)
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

  test("404: Responds with article Id does not exist in the database.",()=>
  {
    return request(app)
    .get("/api/articles/18/comments")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Article_id does not exist.")
    })
  })
  test("200: Responds with an empty array if article Id exists but have no comments.",()=>
    {
      return request(app)
      .get("/api/articles/13/comments")
      .expect(200)
      .then(({body})=>{
        expect(body.comments).toEqual([])
      })
    })

  test("400: Responds with Bad request for sending invalid data.",()=>{
    return request(app)
    .get("/api/articles/invalidid/comments")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request sent.")
    })
  })
})

describe("POST /api/articles/:articles_id/comments",()=>{
  test("200: Responds with comments posted in the database",()=>{
    const postReq = {
      username:"rogersop", 
      body: "I am learning post request!"
    }
    return request(app)
    .post("/api/articles/5/comments")        
    .send(postReq)
    .expect(200)
    .then(({body})=>{
      const comment = body.comment;
      expect(comment.article_id).toBe(5)
      expect(comment.comment_id).toBe(19)
      expect(comment.author).toBe(postReq.username)
      expect(comment.body).toBe(postReq.body)
      
      expect(comment).toMatchObject({
        article_id: expect.any(Number),
        body: expect.any(String),
        votes: expect.any(Number),   
        comment_id: expect.any(Number),     
        author: expect.any(String),
        created_at: expect.any(String),
      })
    })
  })

  test("404: Responds with article id does not exist", ()=>{
      const postReq = {
      username:"rogersop", 
      body: "I am learning post request!"
    }
    return request(app)
    .post("/api/articles/18/comments")
        
    .send(postReq)
    .expect(404)
    .then(({body})=>{
    
      expect(body.msg).toBe("Article_id does not exist.")
      
      //
    })
  })

  test("404: Responds with username does not exist in the database.",()=>{
    const postReq = {
      username:"rogerso", 
      body: "I am learning post request!"
    }
    return request(app)
    .post("/api/articles/5/comments")
    .send(postReq)
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Key (author)=(rogerso) is not present in table \"users\".")
    })
  })

  test("400: Responds with message Bad request if an empty object sent for te post request.",()=>{
    const postReq = { }
    return request(app)
    .post("/api/articles/13/comments")
    .send(postReq)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request sent with no details.")
    })
  })

})

describe("PATCH /api/articles/:article_id",()=>{
  test("200: Responds with article updated with positive votes number sent.",()=>{
    const patchReq = {inc_votes: 40}
    return request(app)
    .patch("/api/articles/1")
    .send(patchReq)
    .expect(200)
    .then(({body})=>{
        const article = body.article
        expect(article.article_id).toBe(1)
        expect(article.votes).toBe(140)

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

  test("200: Responds with article updated with negative votes number sent.",()=>{
    const patchReq = {inc_votes: -20}
    return request(app)
    .patch("/api/articles/1")
    .send(patchReq)
    .expect(200)
    .then(({body})=>{
        const article = body.article
        expect(article.article_id).toBe(1)
        expect(article.votes).toBe(80)

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

  test("404: Responds with article_id does not exist if article_id is not in the table",()=>{
    const patchReq = {inc_votes: 40}
    return request(app)
    .patch("/api/articles/18")
    .send(patchReq)
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Votes could not be updated for article_id 18, article_id does not exist.")
    })
  })

  test("400: Responds with invalid article id sent.",()=>{
    const patchReq = {inc_votes: 40}
    return request(app)
    .patch("/api/articles/wrongtype")
    .send(patchReq)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Invalid article_id sent.")
    })
  })

  test("400: Responds with bad request sent if incorrect data sents.",()=>{
    const patchReq = {inc_votes: "fun"}
    return request(app)
    .patch("/api/articles/1")
    .send(patchReq)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request sent with either No details or incorrect details.")
    })
  })

  test("400: Responds with bad request sent if an empty object of details sent.",()=>{
    const patchReq = {}
    return request(app)
    .patch("/api/articles/1")
    .send(patchReq)
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request sent with either No details or incorrect details.")
    })
  })
} )

describe("DELETE /api/comments/:comment_id",()=>{
  test("204: Responds with no content, deletes the given comment for the comment_id",()=>{

    return request(app)
    .delete("/api/comments/17")
    .expect(204)
    .then(({body})=>{
      expect(body).toEqual({})
    })
  })

  test("404: Responds with Not found error message for comment_id that does not exist.",()=>{
    return request(app)
    .delete("/api/comments/25")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Comment_id not found.")
    })
  })

  test("400: Responds with Bad request error message for invalid comment_id.",()=>{
    return request(app)
    .delete("/api/comments/notid")
    .expect(400)
    .then(({body})=>{
      expect(body.msg).toBe("Bad request sent.")
    })
  })
})

describe("GET /api/users",()=>{
  test("200: Responds with an array of objects with username, name, avatar_url.",()=>{
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(({body})=>{
      const users = body.users
      users.forEach((user)=>{
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String)
        })
      })
    })
  })

})

/*describe("GET /api/articles?sort_by=?order=",()=>{
  test("200: Responds with articles array of objects with comments counts sorted on topic in ascending order.",()=>{
    return request(app)
    .get("/api/articles?sort_by=topic?order=asc")
    .expect(200)
    .then(({body})=>{

      const articles = body.articles
      //to test sort order
      expect(articles).toBeSortedBy('topic');
      //to test if returns records
     // expect(articles.length).toBe(13)


    })

  })
})*/
