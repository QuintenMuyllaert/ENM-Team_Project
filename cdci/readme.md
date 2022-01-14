# CD/CI files for the project

## Prereq's

The server needs Node.js, NPM and PM2 installed

## make a new directory

with mkdir
cd into the new directory

## inside the new directory type following commands

sudo npm i -g nodemon
mkdir main
mkdir dev
mkdir gitmanager
cd main
git clone "THIS REPO"
cd ENM-Team_Project
sudo pm2 start "sudo bash start.sh" --name "main"
cd ../dev
git clone --branch "dev" "THIS REPO"
sudo pm2 start "sudo bash start.sh" --name "dev"
cd ../
sudo cp -R ./dev/cdci ./gitmanager
cd gitmanager
sudo pm2 start "nodemon index.js" --name "gitmanager"
sudo pm2 save

## eval

The project is now installed make sure to correctly add the config.json files to both main & dev!
If done correctly you will be able to view the site as seen in main and/or dev branch.
Changes to the either of the 2 branches will automatically get pulled.
