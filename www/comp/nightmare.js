//nightmare.js... linking data... with userinput... dynamically... do I need to say more...?
let htmlElements = [];
let mqtt = {};
let influx = {};

//Example :
//<p dataElement dataType="elementDefaultsText" dataValue="influx"></p>
//(avgKey(influx.Totaal,"_value")/1000).toFixed(2) + "kWh;

setInterval(async () => {
  const elements = document.querySelectorAll("[dataElement]");
  for (const e of elements) {
    if (e.dataElementLinked) {
      return;
    }

    const type = e.getAttribute("dataType");
    const value = e.getAttribute("dataValue");

    let typevar;
    try {
      typevar = eval(type);
    } catch (e) {
      console.log("Type does not exist.");
      return;
    }

    if (typevar == null || typevar == undefined || typevar == "") {
      typevar = elementDefaultsInnerHTML;
    }

    if (!value) {
      console.error("No value");
      return;
    }

    let text = "N/A";
    try {
      text = eval(value);
    } catch (e) {
      console.error("Something went wrong.");
    }

    new dataElement(e, text, typevar);
  }
}, 50);
