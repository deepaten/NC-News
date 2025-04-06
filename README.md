This project is about seeding a test and development database to build a RESTful server for a cutting-edge news site called NC News.
It has been developed to connect to different databases depending on the environment, using .env files.

Instructions for set up:
1. Clone the repo below:
   https://github.com/deepaten/NC-News  
2. You will need to have Node and npm installed on your local machine.
3. You will need to have Node.js version v20
4. You will also need to make sure you have PostgreSQL installed on your local machine.
5. Create 2 files as below to set the test and development environment
    .env.development 
    .env.test 
5. Write the following line in .env.development:
   PGDATABASE = nc_news
   Write the following line in .env.test:
   PGDATABASE = nc_news_test
6. Run the following command in the console to install dependencies
   npm install
7. Run the following command to create local databases
   npm run setup-dbs
8. Run  the following command to populate the development database.
   npm run seed-dev
9. Run  the following command to populate the test database.
   npm run tes-seed
10.Run  the following command to run the test suit to test the code on test database.
   npm run test

Below is the link for the hosted version for all Apis details
https://nc-news-5kyq.onrender.com/api