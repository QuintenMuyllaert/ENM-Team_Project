const chartInitElectrical = function () {
  const chart = this.element.getContext("2d");
  this.element.graph = new Chart(chart, {
    type: "bar",
    data: {
      labels: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
      datasets: [
        {
          label: "kW/jaar",
          barPercentage: 0.2,
          barThickness: 30,
          maxBarThickness: 100,
          minBarLength: 1,
          data: data,
          backgroundColor: ["red", "gray"],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: "#dc0000",
            font: {
              size: 16,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
