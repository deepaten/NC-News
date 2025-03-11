const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const data = require("../db/data/test-data")


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

  //for testing invalid path
describe("GET /api/tooopics",()=>{
  test("404: Responds with error message",()=>{
    return request(app)
    .get("/api/tooopics")
    .expect(404)
    .then(({body})=>{
      expect(body.msg).toBe("Path not found.")
    })
  })
})