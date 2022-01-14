# CD/CI files for the project

## Prereq's

The server needs Node.js, NPM and PM2 installed

## make a new directory

with mkdir<br>
cd into the new directory<br>

## inside the new directory type following commands

sudo npm i -g nodemon<br>
mkdir main<br>
mkdir dev<br>
mkdir gitmanager<br>
cd main<br>
git clone "THIS REPO"<br>
cd ENM-Team_Project<br>
sudo pm2 start "sudo bash start.sh" --name "main"<br>
cd ../dev<br>
git clone --branch "dev" "THIS REPO"<br>
sudo pm2 start "sudo bash start.sh" --name "dev"<br>
cd ../<br>
sudo cp -R ./dev/cdci ./gitmanager<br>
cd gitmanager<br>
sudo pm2 start "nodemon index.js" --name "gitmanager"<br>
sudo pm2 save<br>

## eval

The project is now installed make sure to correctly add the config.json files to both main & dev!<br>
If done correctly you will be able to view the site as seen in main and/or dev branch.<br>
Changes to the either of the 2 branches will automatically get pulled.<br>
