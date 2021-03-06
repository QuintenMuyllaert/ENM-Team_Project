const num2hex = (n) => {
  const a = Math.round(n < 255 ? n : 255).toString(16);
  return a.length == 1 ? "0" + a : a;
};

const hsv2rgb = (h, s, v) => {
  h = h / 360;
  s = s / 100;
  v = v / 100;

  let r, g, b, i, f, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const rgb2hex = (r, g, b) => {
  return `#${num2hex(r)}${num2hex(g)}${num2hex(b)}`;
};

const hsv2hex = (h, s, v) => {
  return rgb2hex(...hsv2rgb(h, s, v));
};

const chartPieInit = function () {
  this.data = { ...{ title: "", labels: [], data: [] }, ...this.data };
  this.element = document.querySelector(this.query);
};

const chartPieRender = async function () {
  this.update(true);
  await delay(500);
  this.update(false);
};

const chartPieUpdate = function (clear = false) {
  const title = this.data.title;
  let data = this.data.data;
  const labels = this.data.labels;

  let total = data.reduce((a, b) => a + b, 0);
  const count = data.length;
  this.element.querySelector(".piechart--center-label").textContent = title;
  this.element.querySelector(".piechart--center-value").textContent = Math.round(total * 100) / 100;

  const piechart = this.element.querySelector(".piechart");
  const legend = this.element.parentNode.querySelector(".js-legend");

  const c = piechart.querySelectorAll(".js-pie");
  const same = data.length == c.length / 2;
  if (!same || clear) {
    for (let e of c) {
      e.remove();
    }
  }

  legend.innerHTML = "";
  let colors = [];
  let cleanedData = [];

  const per = 1;
  const onePercent = total / 100;
  total = total + onePercent * per * data.length;
  for (let i = 0; i < data.length; i++) {
    const col = hsv2hex((i * 360) / count, 100, (i % 2) * 25 + 75);
    legend.innerHTML += `<li class="piechart--info-legend-item">
        <div class="piechart--info-legend-item-color" style="background-color:${col};"></div>
        <p class="piechart--info-legend-item-text">${labels[i] ? labels[i] : "no label"}</p>
      </li>`;

    cleanedData.push((100 * data[i]) / total);
    cleanedData.push(per);

    colors.unshift(col);
    colors.unshift("#ffffff");
  }
  data = cleanedData.reverse();

  if (!same || clear) {
    for (let i in data) {
      piechart.innerHTML += `<circle class="piechart--circle js-pie"></circle>`;
    }
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

    piece.style.stroke = i % 2 == 0 ? "#FFFFFF" : colors[i];
    piece.style["stroke-width"] = i % 2 == 0 ? 12 : 10;
    percentage = (duiktank / 100) * 283.14; //283.140 is de top en zorgt voor niks van percentage (100%)
    piece.style["stroke-dashoffset"] = percentage;
  }
};

const elementDefaultsPie = {
  init: chartPieInit,
  render: chartPieRender,
  update: chartPieUpdate,
};
