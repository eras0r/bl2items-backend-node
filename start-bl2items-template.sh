#!/bin/bash

# bash script to start the bl2items-backend-node in development mode

#setup node environment
export NODE_ENV=development

# setup required environment variables
export BL2ITEMS_MONGODB_DB_HOST=127.0.0.1
export BL2ITEMS_MONGODB_DB_PORT=27017
export BL2ITEMS_MONGODB_DB_USERNAME=bl2items
export BL2ITEMS_MONGODB_DB_PASSWORD=your_pw
export BL2ITEMS_MONGODB_DB_NAME=bl2items

#finally start the application
node .
