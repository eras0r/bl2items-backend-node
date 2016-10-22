#!/bin/bash

#starts the bl2items-backend-node in development mode

#etup node environment
export NODE_ENV=development

# setup required environment variables
export BL2ITEMS_MONGODB_DB_HOST=127.0.0.1
export BL2ITEMS_MONGODB_DB_PORT=27017
export BL2ITEMS_MONGODB_DB_USERNAME=TODO #TODO insert db username
export BL2ITEMS_MONGODB_DB_PASSWORD=TODO #TODO insert db user password
export BL2ITEMS_MONGODB_DB_NAME=TODO #TODO insert db name

#finally start our app
node .
