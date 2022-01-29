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
      typevar = eval(`(() => {return ${type}})()`);
    } catch (e) {
      console.log("Type does not exist.");
      return;
    }

    if (typevar == null || typevar == undefined || typevar == "") {
      typevar = elementDefaultsInnerHTML;
    }

    let valuevar;
    try {
      valuevar = eval(`(() => {return ${value}})()`);
    } catch (e) {
      console.log("Value does not exist.");
      return;
    }

    if (typevar == null || typevar == undefined || typevar == "") {
      valuevar = "N/A";
    }

    new dataElement(e, valuevar, typevar);
  }
}, 50);
