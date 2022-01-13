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

const drawPie = (element, title = "KW/uur", data = [25, 25, 80, 50, 50, 50, 50], labels = []) => {
  const total = data.reduce((a, b) => a + b, 0);
  const count = data.length;
  element.querySelector(".piechart-center-label").textContent = title;
  element.querySelector(".piechart-center-value").textContent = total;
  const legend = element.parentNode.querySelector(".js-legend");
  let colors = [];
  for (let i = 0; i < data.length; i++) {
    const col = hsv2hex((i * 360) / count, 100, (i % 2) * 25 + 75);
    legend.innerHTML += `<li class="piechart--info-legend-item">
        <div class="piechart--info-legend-item-color" style="background-color:${col};"></div>
        <p class="piechart--info-legend-item-text">${labels[i] ? labels[i] : "no label"}</p>
      </li>`;
    data[i] = Math.round((100 * data[i]) / total);
    colors.unshift(col);
  }
  data = data.reverse();

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
