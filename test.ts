import test from 'ava';
import request from 'request-promise';

test('Convert 1 USD to JPY - Not equal undefined', async t => {
  let testPayload = {
    method: 'POST',
    uri: 'http://localhost:3000/convert',
    body: { 
      "to": "JPY", 
      "from": "EUR", 
      "value": "1.00", 
      "precision": 2 
    },
    json: true
  };

  const body = await request.post(testPayload);
  
  t.not(body, undefined);
});

test('Convert 1 USD to JPY - body.to equal JPY', async t => {
  let testPayload = {
    method: 'POST',
    uri: 'http://localhost:3000/convert',
    body: { 
      "to": "JPY", 
      "from": "EUR", 
      "value": "1.00", 
      "precision": 2 
    },
    json: true
  };

  const body = await request.post(testPayload);

  t.deepEqual(body.to, "JPY");
});

test('Convert 1 USD to JPY - body.from equal EUR', async t => {
  let testPayload = {
    method: 'POST',
    uri: 'http://localhost:3000/convert',
    body: { 
      "to": "JPY", 
      "from": "EUR", 
      "value": "1.00", 
      "precision": 2 
    },
    json: true
  };

  const body = await request.post(testPayload);

  t.deepEqual(body.from, "EUR");
});

test('Convert 1 USD to JPY - precision equal 2', async t => {
  let testPayload = {
    method: 'POST',
    uri: 'http://localhost:3000/convert',
    body: { 
      "to": "JPY", 
      "from": "EUR", 
      "value": "1.00", 
      "precision": 2 
    },
    json: true
  };

  const body = await request.post(testPayload);

  t.deepEqual(body.convertedValue.split('.')[1].length, 2);
});

test('Convert 1 USD to JPY - precision equal 5', async t => {
  let testPayload = {
    method: 'POST',
    uri: 'http://localhost:3000/convert',
    body: { 
      "to": "JPY", 
      "from": "EUR", 
      "value": "1.00", 
      "precision": 5
    },
    json: true
  };

  const body = await request.post(testPayload);

  t.deepEqual(body.convertedValue.split('.')[1].length, 5);
});