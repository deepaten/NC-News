const {
  convertTimestampToDate,
  createArticleLookup,
  formatComments} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("createArticleLookup function testing",(()=>{
  test("Returns an empty object when passed an empty array", (()=>{
    //arrange
    // act
    const result = createArticleLookup([]);
    //assert
    expect(result).toEqual({});
  }))
  test("Returns an object with key value pair for article title name: article id for 1 record", (()=>{
    //arrange
    const input =[{
        article_id: 13,
        title: 'Another article about Mitch',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'There will never be enough articles about Mitch!',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }]
      // act
    const result = createArticleLookup(input);
    //assert
    expect(result).toEqual({"Another article about Mitch": 13});
  }))

  
  test("Returns an object with key value pair, article title name: article id for 1  for multiple records ", (()=>{
    //arrange
    const input =[
      {
        article_id: 10,
        title: 'Seven inspirational thought leaders from Manchester UK',
        topic: 'mitch',
        author: 'rogersop',
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: '2020-05-14T04:15:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      },
      { article_id: 13,
        title: 'Another article about Mitch',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'There will never be enough articles about Mitch!',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }]
      // act
    const result = createArticleLookup(input);
    const expectedResult = {"Another article about Mitch": 13, "Seven inspirational thought leaders from Manchester UK": 10};
    //assert
    expect(result).toEqual(expectedResult);
  }))

  test("Test that the function does not mutate the input", (()=>{
    //arrange
    const input =[{
        article_id: 13,
        title: 'Another article about Mitch',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'There will never be enough articles about Mitch!',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }]
   const inputAfterCall =[{
        article_id: 13,
        title: 'Another article about Mitch',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'There will never be enough articles about Mitch!',
        created_at: '2020-10-11T11:24:00.000Z',
        votes: 0,
        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
      }]
      // act
    const result = createArticleLookup(input);
    //assert
    expect(input).toEqual(inputAfterCall);
  }))
}))


describe("formatComments function testing",(()=>{
  test("Returns an empty array when passed an empty array", (()=>{
    //arrange
    // act
    const result = formatComments([], []);
    //assert
    expect(result).toEqual([]);
  }))

  test("Returns an array of 1 object with article id added to the object for the specific article title name", (()=>{
    //arrange
    const lookupObject ={"Living in the shadow of a great man": 1}
    const comments = [{
    article_title: "Living in the shadow of a great man",
    body: "I find this existence challenging",
    votes: 100,
    author: "butter_bridge",   
    created_at: '2020-07-09T20:11:00.000Z'}]

    // act
    const result = formatComments(comments, lookupObject);
    const expectedResult =[
      {
      article_id: 1,
      body: "I find this existence challenging",
      votes: 100,
      author: "butter_bridge",
      created_at: '2020-07-09T20:11:00.000Z'}]
    //assert
    expect(result).toEqual(expectedResult);
  }))

  test("Returns an array of objects with article id added to the object for the article title name for multiple objects", (()=>{
    //arrange
    const lookupObject ={"Living in the shadow of a great man": 1, "They're not exactly dogs, are they?":9}
    const comments = [{
    article_title: "Living in the shadow of a great man",
    body: "I find this existence challenging",
    votes: 100,
    author: "butter_bridge",   
    created_at: '2020-07-09T20:11:00.000Z'},
    {article_title: "They're not exactly dogs, are they?",
    body: "Well? Think about it.",
    votes: 20,
    author: "butter_bridge",
    created_at: '2020-06-06T09:10:00.000Z'} ]

    // act
    const result = formatComments(comments, lookupObject);
    const expectedResult =[
      {
      article_id: 1,
      body: "I find this existence challenging",
      votes: 100,
      author: "butter_bridge",
      created_at: '2020-07-09T20:11:00.000Z'},
      {article_id:9,
      body: "Well? Think about it.",
      votes: 20,
      author: "butter_bridge",
      created_at: '2020-06-06T09:10:00.000Z'}
    ]
    //assert
    expect(result).toEqual(expectedResult);
  }))

  test("Test that the function does not mutate input values", (()=>{
    //arrange
    const lookupObject ={"Living in the shadow of a great man": 1}
    const comments = [{
    article_title: "Living in the shadow of a great man",
    body: "I find this existence challenging",
    votes: 100,
    author: "butter_bridge",   
    created_at: '2020-07-09T20:11:00.000Z'}]
    const commentsAfterCall = [{
      article_title: "Living in the shadow of a great man",
      body: "I find this existence challenging",
      votes: 100,
      author: "butter_bridge",   
      created_at: '2020-07-09T20:11:00.000Z'}]
    const lookupObjectAfterCall ={"Living in the shadow of a great man": 1}
 

    // act
    const result = formatComments(comments, lookupObject);
    //assert
    expect(comments).toEqual(commentsAfterCall);
    expect(lookupObject).toEqual(lookupObjectAfterCall);
  }))
}))

