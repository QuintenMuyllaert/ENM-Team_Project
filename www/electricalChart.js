const drawChart = (data) => {
  const chartHTML = document.querySelector(".js-electrical-graph");
  if (!chartHTML) {
    return;
  }
  const chart = chartHTML.getContext("2d");
  graph = new Chart(chart, {
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
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
          backgroundColor: ["red", "gray"]
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
              size: 16
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
