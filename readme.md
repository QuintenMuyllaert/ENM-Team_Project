# ENM - Team Project

- Quinten Muyllaert
- Toby Bostoen
- Jorrit Verfaillie
- Florian Milleville

## config.json

When cloning the repository, make sure that you make a config.json file in the root of the repository.<br>
The config file needs to include the following:<br>

```json
{
    "port": WEBPORTNUMBER,
    "url": INFLUXDBURL,
    "token": INFLUXDBTOKEN,
    "org": INFLUXDBORG,
    "bucket": INFLUXDBBUCKET,
    "topic": TOPIC,
    "mqtt": MQTTURL
}
```

## Usage

To run the server you need to have NodeJS & NPM installed.<br>
Make sure to have the correct config.json file (structure written above) included in the **ROOT** of the repository!<br>
Afterwards you can run the included `"start.bat"` (Windows) / `"start.sh"` (Linux) script and it will start the server on the specified port specified in the config.json.<br>
