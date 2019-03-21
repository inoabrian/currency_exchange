import * as http from "http";
import * as micro from "micro";
import * as router from "microrouter";
import * as mongo from 'mongodb';
import * as xmljs from 'xml-js';
import * as fetch from "node-fetch";
import * as mathjs from "mathjs";

import * as db from "./database";
import * as exchange_response_model from "./models/ExchangeResponse";
import * as conversion_model from "./models/ConversionPayload";
import * as exchange_request_model from "./models/ExchangeRequestPayload";

// function to handle the conversion of the currencies
const convertCurrency: (to: exchange_response_model.Cube3, from: exchange_response_model.Cube3, value: string, precision?: number) =>
    string = (to: exchange_response_model.Cube3, from: exchange_response_model.Cube3, value: string, precision: number = 2) => {
        // We need to check how many conversions we need to complete to get our result
        // CURRENCY ||  CURRENCY ||  STEPS
        // EUR      ->  OTHER    = 1 (MULTIPLICATION)
        // OTHER    ->  EUR      = 1 (DIVISION)
        // OTHER    ->  OTHER    = 2 (MULTIPLICATION INTO EURO THEN MULTIPLY EURO TO SECOND CURRENCY)

        let expression: string;

        if (to._attributes.currency === "EUR") {
            expression = mathjs.eval(`${value} / ${from._attributes.rate}`);
        }
        else if (from._attributes.currency === "EUR") {
            expression = mathjs.eval(`${value} * ${to._attributes.rate}`);
        }
        else {
            let euroConversion = mathjs.format(
                mathjs.eval(`${value} * ${from._attributes.rate}`), 
                { notation: 'fixed', precision: precision }
            );
            
            // From EUR to Requested currency
            expression = mathjs.eval(`${euroConversion} * ${to._attributes.rate}`);
        }

        return mathjs.format(
            expression,
            { notation: 'fixed', precision: precision }
        );
    };

// function to parse and convert the euro exchange data to json
const parseXMLToJSON: (xml2Convert: string) => string = (xml2Convert: string) => {
    return xmljs.xml2json(xml2Convert, { compact: true, spaces: 4 });
};

// function to save our conversion transaction to our database
const logTransaction: (transaction: conversion_model.ConversionPayload) => Promise<mongo.InsertOneWriteOpResult> = async (transaction: conversion_model.ConversionPayload) => {
    try {
        // mongo db connection promise
        let dbConnection: () => Promise<mongo.MongoClient> = db.default;
        let connection: mongo.MongoClient = await dbConnection();

        let writeConfirmation = await connection.db()
            .collection(process.env.MONGO_COLLECTION)
            .insertOne(transaction);

        await connection.close();

        return new Promise((resolve, reject) => resolve(writeConfirmation));
    }
    catch (err) {
        return new Promise((resolve, reject) => reject(err));
    }
};



// service logic to handle our /convert route POST request
const convertHandler: router.AugmentedRequestHandler = async (request: router.ServerRequest, response: http.ServerResponse): Promise<any> => {

    try {
        // We will get the conversion information from our request object
        const postBody: exchange_request_model.ExchangeRequestPayload = <exchange_request_model.ExchangeRequestPayload>await micro.json(request);

        // Check if we are being asked to convert to EUR from a different currency
        if (postBody.to === "" || postBody.to === null) {
            micro.send(response, 400, "to payload property cannot be empty");
        }
        else if (postBody.from === "" || postBody.from === null) {
            micro.send(response, 400, "from payload propery cannot be empty");
        }

        // We will fetch the european central bank rates at request time
        // NOTE: We can definitely improve this approach by creating a cache system that will update the values daily
        let dailyExchangeInformation: fetch.Response = await fetch.default(process.env.EXCHANGE_INFO_URI);

        // We extract the actual XML data from our request
        let dailyExchangeInformationXML: string = await dailyExchangeInformation.text();

        // We parse convert the xml data to json for easier use
        let dailyExchangeInformationJSON: exchange_response_model.ExchangeResponse = JSON.parse(parseXMLToJSON(dailyExchangeInformationXML));

        // extract the needed currency information
        let convertToRate = dailyExchangeInformationJSON["gesmes:Envelope"].Cube.Cube.Cube.filter((element) => postBody.to === element._attributes.currency);
        let convertFromRate = dailyExchangeInformationJSON["gesmes:Envelope"].Cube.Cube.Cube.filter((element) => postBody.from === element._attributes.currency);

        // if one either to or from are EUR we need to assign an empty entry
        if (convertToRate.length === 0 || convertFromRate.length === 0) {
            if (postBody.to === "EUR") {
                convertToRate = [ new exchange_response_model.Cube3() ];
            }

            if (postBody.from === "EUR") {
                convertFromRate = [ new exchange_response_model.Cube3() ];
            }
        }

        const calculatedConversion: string = convertCurrency(convertToRate[0], convertFromRate[0], postBody.value, postBody.precision);

        let result: conversion_model.ConversionPayload = <conversion_model.ConversionPayload>{
            to: postBody.to,
            from: postBody.from,
            value: postBody.value,
            convertedValue: calculatedConversion
        };

        let transactionLog: mongo.InsertOneWriteOpResult = await logTransaction(result);

        micro.send(response, 200, result);
    }
    catch (err) {
        micro.send(response, 500, err);
    }
};

/* 
    Method:     POST
    route:      /convert
    payload:    { to: "USD", from: "JPY", value: "1.00", precision: 2 }
*/
const service: micro.RequestHandler[] = [
    router.post('/convert', convertHandler)
];

micro.default(router.router(...service))
.listen(process.env.PORT || 3000, () => {
    console.log(`service listening ${process.env.PORT || 3000}`);
});

export = service;