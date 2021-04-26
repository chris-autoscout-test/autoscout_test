#Autoscout24 coding test

## About

This project is a Node/express/typescript backend with a very small React frontend in order to render the reports.
The server for this project acts as a backend and has the following endpoints

| API Path                        | Method | Description                                                    |
| ------------------------------- | ------ | -------------------------------------------------------------- |
| /api/contacts                   | GET    | Get all the currently stored contacts                          |
| /api/contacts                   | POST   | Using multipart form upload to update contacts CSV             |
| /api/listings                   | GET    | Get all currently store listings                               |
| /api/listings                   | POST   | Using multipart form upload to update listings CSV             |
| /api/reports/                   | GET    | aggregate all other report endpoints into one                  |
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

if you would like to run the tests this can done by running the following command

```bash
npm run tests
```

## Milestones

1. Write a web application that displays / outputs the reports. This can be server generated html with no styling or some form of api depending on your preferences. Keep it simple!
   NOTE: This already fulfills the minimum requirements!

> Webpage can be accessed by running the app and going to localhost:8080/ in your browser

2. The project manager reaches out to you and mentions that they will want regularly to provide new input files
   - Add an upload endpoint to the server that receives CSV files, validates their format and uses the data in the uploaded CSV to fulfill the above requirements for subsequent requests

> CSV can be uploaded via posting to `/api/contacts` and `/api/listings` with the csv. This can also be viewed by using the file upload on the
> webpage or using the flowing curl request

```bash
curl -X POST \
http://localhost:8080/api/listings \
-H 'Content-Type: application/x-www-form-urlencoded' \
-H 'Host: localhost:8080' \
-F csv={path to a csv}

```

> I have also included some test files in test-data to test this out with and there is a backup of the original csv in src/static

3. Engineers from another team reach out and would like to re-use your aggregations. Add an api endpoint which exposes the data in a structured format.

> All reports are available via a REST API but I did also add an `/api/reports` endpoint that aggregates these together
