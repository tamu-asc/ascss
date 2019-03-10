# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

To run the application on heroku, we need an environment variable in the heroku application which is the secret key used for the encryption. That file should never be checked in into the github.
The command to do that is 
heroku config:set RAILS_MASTER_KEY=`cat config/master.key`
