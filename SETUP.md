# System requirements
* Ruby version: 2.6.1
* Rails version: 5.2.2
* Bundler version: 2.0.1

# Local Development Setup
* Clone this repository in your desktop. 

For HTTPS clone:
```bash
git clone https://github.com/tamu-asc/ascss.git
```
For SSH clone: 
```bash
git clone git@github.com:tamu-asc/ascss.git
```

* Copy the master.key [file](https://drive.google.com/a/tamu.edu/file/d/10WJhZUfyKjZCBkTyTh3f_G4Lsq0d1PLb/view?usp=sharing) into the config folder

* Make sure the required versions of rails, ruby and bundler are installed and in use.
```bash
rvm install ruby-2.6.1
rvm use --default ruby-2.6.1
gem install rails -v 5.2.2
gem install bundler -v 2.0.1
```

* Setup the database for the first time
```bash
bin/bundle exec rake db:create
```

* Run the service via command
```bash
bin/rails server -b 120.0.0.1 -p 3000
```

# Production level Setup
* Clone the repository (refer above)

* Make sure the correct branch or release/tag is specified

* Copy the master.key file in the correct location.

* Make sure the correct versions of rails, ruby and bundler are in use.

* Make sure the env variable DATABASE_URL is configured correctly. The format of the environment variable is
    * **Postgres**: postgres://\<user\>:\<pass\>@\<host\>:\<port\>/\<database\>
    
* Make sure the env variable RAILS_ENV is set to production

* Setup the database for the first time if not already done

* Run the server

# Heroku setup
* Clone the repository (refer above)

* Copy the master.key file in the correct location.

* Create a new heroku app and follow the instructions to set-up the heroku app. Heroku will take care of everything including the versioning.

* To publish the master.key file to the heroku host use this command
```bash
heroku config:set RAILS_MASTER_KEY=`cat config/master.key` 
```

* To create the database for the first time run the command on heroku 
```bash
heroku run bin/bundle exec rake db:create
```
