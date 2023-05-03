# Heartbeat monitor 

Different client applications will periodically send heartbeats to this service, and the service keeps track of them, periodically removing those that didn't send any heartbeats in some configured time frame.

The default heartbeat timeout is 60 seconds. 

## Getting started

Install dependencies
```bash
npm install
```

Start the compiler in watch mode
```bash
npm run dev
```

Run the server
```bash
npm start
```

## Running tests

Make sure you ran the compiler first. Then run:
```bash
npm test
```

## Considerations

### DB
This service needs to be able to scale horizontally, that means several instances
of this service will be running in parallel and requests to it will be shared between
instances by a load balancer. To guarantee that the data is the same across all of them
we need to use a DB. Since this data is not relational and we are expecting to receive 
unstructured meta data a MongoDB instance it's a good choice.

### Tests
The tests available are E2E tests of the endpoints to test the whole system.