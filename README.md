# Borderlands 2 items database backend

[![Build Status](https://travis-ci.org/eras0r/bl2items-backend-node.svg?branch=master)](https://travis-ci.org/eras0r/bl2items-backend-node)
[![Dependency Status](https://www.versioneye.com/user/projects/56bdeec22a29ed002d2b0b59/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56bdeec22a29ed002d2b0b59)
[![Stories in Ready](https://badge.waffle.io/eras0r/bl2items-backend-node.png?label=ready&title=Ready)](https://waffle.io/eras0r/bl2items-backend-node)

NodeJS implemenation of a REST API for [Borderlands 2](http://www.gearboxsoftware.com/games/borderlands-2) items.

## Architecture
The application uses the [LoopBack](http://loopback.io).
It uses a [mongoDB] (https://www.mongodb.org/) noSQL database to store its data.

## Prerequisites
* [npm] (https://www.npmjs.org/) installed
* running instance of [mongoDB] (https://www.mongodb.org/)

## Setup

### Clone the repo
In order to run the application just clone this repo.
```
git clone https://github.com/eras0r/bl2items-backend-node
```

### Install npm dependencies
navigate the the directory where your clone is located and install npm dependencies
```
npm install
```

### configure required environment variables
The application has support different environments. See [Loopback Environment](https://docs.strongloop.com/display/public/LB/Environment-specific+configuration) for more information about that.
The environment is determined by considering the NODE_ENV environment variable. If NODE_ENV is not set "development" will be used as default

In order to run the application in development mode you need to setup the following environment variables

| Environment veriable name    | Description                                     | Example    |
| ---------------------------- | ----------------------------------------------  | ---------- |
| BL2ITEMS_MONGODB_DB_HOST     | IP address or hostname of you mongoDB instance. | 127.0.0.1  |
| BL2ITEMS_MONGODB_DB_PORT     | Port od your mongoDD instance.                  | 27017      |
| BL2ITEMS_MONGODB_DB_USERNAME | Username of the mongoDB user to be used.        | bl2items   |
| BL2ITEMS_MONGODB_DB_PASSWORD | Password of the mongoDB user to be used.        | your_pw    |
| BL2ITEMS_MONGODB_DB_NAME     | Name of the mongoDB database.                   | bl2items   |

If those environment variables have been setup you can run the application with the following command from the directory where you cloned the code.
```
node .
```

#### bash start script
As an alternative you can use the [bash script template](start-bl2items-template.sh) to run the application.
