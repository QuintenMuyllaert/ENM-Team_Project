const rngHex = () => {
  const a = Math.round(Math.random() * 255).toString(16);
  return a.length == 1 ? "0" + a : a;
};

const rngColor = () => {
  return `#${rngHex()}${rngHex()}${rngHex()}`;
};

const drawPie = (element, data = [25, 25, 80]) => {
  const total = data.reduce((a, b) => a + b, 0);
  element.querySelector(".piechart-center-value").innerHTML = total;

  let colors = [];
  data = data.reverse();
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.round((100 * data[i]) / total);
    colors.push(rngColor());
  }

  const piechart = element.querySelector(".piechart");
  for (let i in data) {
    piechart.innerHTML += `<circle class="piechart--circle js-pie"></circle>`;
  }

  let sum = 0;
  const points = [];
  const children = piechart.querySelectorAll(".js-pie");

  data.unshift(0);
  for (let i in data) {
    duiktank = 100 - (data[i] + sum);
    points.push(duiktank);
    sum += data[i];
  }
  points.pop();

  for (let i in points) {
    const piece = children[i];
    duiktank = 100 - points[i];

    piece.style.stroke = colors[i];
    percentage = (duiktank / 100) * 283.14; //283.140 is de top en zorgt voor niks van percentage (100%)
    piece.style["stroke-dashoffset"] = percentage;
  }
};
