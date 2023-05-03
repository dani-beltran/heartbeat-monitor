# Heartbeat monitor 
![API E2E Tests badge](https://github.com/dani-beltran/heartbeat-monitor/actions/workflows/build-and-test.yml/badge.svg)

Different client applications will periodically send heartbeats to this service, and the service keeps track of them, periodically removing those that didn't send any heartbeats in some configured time frame.

The default heartbeat timeout is 60 seconds, but can be configurable changing the
environment variable HEARTBEAT_TIMEOUT which is in milliseconds.

## Getting started

Install dependencies
```bash
npm install
```

Run MondoDB (You will need Docker and docker-compose in your system)
```bash
npm run start:db
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

## Considerations and decisions

### DB
This service needs to be able to scale horizontally, that means several instances
of this service will be running in parallel and requests to it will be shared between
instances by a load balancer. To guarantee that the data is the same across all of them
we need to use a DB. Since this data is not relational and we are expecting to receive 
unstructured meta data a MongoDB instance it's a good choice.

### Removing expired instances
The service should periodically remove expired instances. These are the ones which
didn't send a heartbeat for a period of time, this time to be defined by the environment
variable HEARTBEAT_TIMEOUT which is in milliseconds.

Because this service needs to scale horizontally and it only has one DB instance,
to trigger the removing of the data from each service instance would be inefficient.
Imagine the situation where we have 1000 load balanced instances of this service and all of them 
trigger calls to the DB to delete the expire data repeatedly, most of those call will be redundant.

One better solution could be to setup a separate cronjob process that runs periodically, 
lets say, every couple of minutes, and deletes the expired data. This way only the
cronjob is sending the delete requests to the DB and redundant calls are avoided. 

However, we can't guarantee that the cronjob will run perfectly synchronized with services and
we can have situations where expired data is still present in the DB, so this 
require that in the service API we filter expired data out when querying from 
the DB and that's what it's implemented in my approach.

There's an example of a cronjob for this task in `src/bin/cron-cleaner.ts`. 
It ca be run with:
```bash
npm run start:cronjob
```

### Tests
The tests available are E2E tests of the endpoints to test the whole system.
