#Autoscout24 coding test

## About

This project is a Node/express/typescript backend with a very small React frontend in order to render the reports.
The server for this acts as a backend and has the following endpoints

| API Path                        | Method | Description                                                    |
| ------------------------------- | ------ | -------------------------------------------------------------- |
| /api/contacts                   | GET    | Get all the currently stored contacts                          |
| /api/contacts                   | POST   | Using multipart form upload to update contacts CSV             |
| /api/listings                   | GET    | Get all currently store listings                               |
| /api/listings                   | POST   | Using multipart form upload to update listings CSV             |
| /api/reports/average_price      | GET    | Get average price per seller type                              |
| /api/reports/distribution       | GET    | Get the distribution of each vehicle make in the listings data |
| /api/reports/top_percentile     | GET    | Get the average price of the top 30% of listings               |
| /api/reports/listings_per_month | GET    | Get a breakdown of the top 5 listings in each month            |
| /                               | GET    | Get the homepage                                               |

## How to run it.

All that is required to run this project is nodeJS the setup is as follows:

```bash
#install dependencies
npm install
```

then in order to run the project all you need to do is

```bash
npm start
```

if you would like to run the tests this can be achived with

```bash
npm run tests
```
