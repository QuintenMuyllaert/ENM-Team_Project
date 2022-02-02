const chartInitDayNight = function () {
  if (this.element.graph) {
    return;
  }

  const chart = this.element.getContext("2d");
  this.element.graph = new Chart(chart, {
    type: "bar",
    data: {
      labels: this.data.labels,
      datasets: [
        {
          label: "kW",
          barPercentage: 0.2,
          barThickness: 70,
          maxBarThickness: 100,
          minBarLength: 1,
          data: this.data.data,
          backgroundColor: ["red", "gray"],
        },
      ],
    },
    options: {
      indexAxis: "y",
      maintainAspectRatio: false,
      responsive: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: "#dc0000",
            font: {
              size: 20,
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 20,
            },
          },
        },
        x: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 20,
            },
          },
        },
      },
    },
  });
};
