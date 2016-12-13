# SimpleLogin
Two-factor Authentication using Authy

prerequisites 
8 bower,composer,mysql,php
authy account
clone the repo to the apache web root

create new database

source server/database.sql

update the databse settings and authy api key server/config.ini

# Run following commands

cd server && composer install
cd ../
cd client && bower install
