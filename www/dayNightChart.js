const drawChartDayNight = async (data = [20, 10]) => {
  const chartHTML = document.querySelector(".js-day-night");
  if (!chartHTML) {
    return;
  }
  const chart = chartHTML.getContext("2d");
  if (chartHTML.graph) {
    chartHTML.graph.data.datasets[0].data = [];
    chartHTML.graph.update();
    await delay(500);
    chartHTML.graph.data.datasets[0].data = data;
    chartHTML.graph.update();
    return;
  }

  chartHTML.graph = new Chart(chart, {
    type: "bar",
    data: {
      labels: ["dag", "nacht"],
      datasets: [
        {
          label: "kW",
          barPercentage: 0.2,
          barThickness: 70,
          maxBarThickness: 100,
          minBarLength: 1,
          data: data,
          backgroundColor: ["red", "gray"],
        },
      ],
    },
    options: {
      indexAxis: 'y',
      maintainAspectRatio: false,
      responsive: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: "#dc0000",
            font: {
              size: 200,
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
