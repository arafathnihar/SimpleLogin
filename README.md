# SimpleLogin
Two-factor Authentication using Authy

###### prerequisites
 bower,composer,mysql,php
 authy account
 authy mobile app
 
clone the repo to the apache web root

create new database

source server/database.sql

update the databse settings and authy api key server/config.ini

# Run following commands

cd server && composer install
cd ../
cd client && bower install

go to url /client

if you are testing locally expose the local server to web using ngrok
