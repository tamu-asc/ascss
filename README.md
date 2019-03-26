# README

## System Requirements

* Ruby version: 2.6.1

* Rails version: 5.2.2

* Configuration: Please copy the master.key file shared to you in the config folder

To run the application on heroku, we need an environment variable in the heroku application which is the secret key used for the encryption. That file should never be checked in into the github.
The command to do that is 
```bash
heroku config:set RAILS_MASTER_KEY=`cat config/master.key`
```
