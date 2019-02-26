# Tax-Fix Challenge

## **Currency Conversion Service**

### **Project Setup**

Prerequisites:

- Mongo DB

- Node.js >= 8
  

## **Install Dependencies**

Execute npm install in the project directory to install dependencies.    

## Technologies

I chose to Node.js for this service using the following modules:

-  **micro** - _Asynchronous HTTP microservices_

-  **micro-router** - A tiny and functional router for ZEIT's [micro](https://github.com/zeit/micro)

-  **mongodb** - The official [MongoDB](https://www.mongodb.com/) driver for Node.js. Provides a high-level API on top of [mongodb-core](https://www.npmjs.com/package/mongodb-core) that is meant for end users.

- **mathjs** - An extensive math library for JavaScript and Node.js.

- **xml-js** - Convert XML text to Javascript object / JSON text (and vice versa)

- **node-fetch** - A light-weight module that brings `window.fetch` to Node.js

## Startup

To run our tests execute: **npm test**

To run docker execute: **npm run docker-debug** 

You can test the convert route with the following:

    curl -X POST \
    http://localhost:3000/convert \
    -H 'Content-Type: application/json' \
    -H 'cache-control: no-cache' \
    -d '{ "to": "JPY", "from": "EUR", "value": "1.00", "precision": 2 }'

**Response**:

    {
        "to": "JPY",
        "from": "EUR",
        "value": "1.00",
        "convertedValue": "125.75",
        "_id": "5c7482b7bfd1f600100bb01a"
    }
