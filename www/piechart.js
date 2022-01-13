const rngHex = () => {
  const a = Math.round(Math.random() * 255).toString(16);
  return a.length == 1 ? "0" + a : a;
};

const drawPie = () => {
  const piechart = document.querySelector(".piechart");

  let data = [25, 25, 25, 10, 10, 5];
  for (let p of data) {
    piechart.innerHTML += `<circle class="duiktank--circle js-pie" data-name="duiktank"></circle>`;
  }

  let sum = 0;
  let points = [];
  const children = piechart.querySelectorAll(".js-pie");
  for (let i in children) {
    duiktank = 100 - (data[i] + sum);
    points.push(duiktank);
    sum += data[i];
  }

  for (let i in children) {
    let piece = children[i];

    duiktank = 100 - points[i];

    piece.style.stroke = `#${rngHex() + rngHex() + rngHex()}`;
    percentage = (duiktank / 100) * 283.14;
    piece.style.strokeDashoffset = percentage;
    //283.140 is de top en zorgt voor niks van percentage (100%)
  }
};
