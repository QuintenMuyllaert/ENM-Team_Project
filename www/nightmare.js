//nightmare.js... linking data... with userinput... dynamically... do I need to say more...?
let htmlElements = [];
let mqtt = {};
let influx = {};

//Example :
//<p dataElement dataType="elementDefaultsText" dataValue="influx"></p>
//(avgKey(influx.Totaal,"_value")/1000).toFixed(2) + "kWh;

setInterval(() => {
  document.querySelectorAll("[dataElement]").forEach((e) => {
    const type = e.getAttribute("dataType");
    const value = e.getAttribute("dataValue");

    if (!type) {
      console.error("No type");
      return;
    }
    if (!value) {
      console.error("No value");
      return;
    }

    let text = "N/A";
    try {
      text = eval(value).toString();
    } catch (e) {
      console.error("Something went wrong.");
    }
    console.log(text);
    //e.innerHTML = text;
  });
}, 50);
