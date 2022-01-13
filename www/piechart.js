const rngHex = () => {
  const a = Math.round(Math.random() * 255).toString(16);
  return a.length == 1 ? "0" + a : a;
};

const drawPie = (data = [25, 25, 20, 15, 5, 5, 5]) => {
  let colors = ["#FF0000"];

  data = data.reverse();
  for (let i = 0; i < data.length; i++) {
    colors.push(Math.round(i * 16777215) / data.length);
  }

  const piechart = document.querySelector(".piechart");
  for (let i in data) {
    piechart.innerHTML += `<circle class="duiktank--circle js-pie" data-name="duiktank"></circle>`;
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
    piece.style.strokeDashoffset = percentage;
  }
};
