const drawChart = (data) => {
  let chart = document.querySelector('.js-electrical-graph').getContext('2d');
  graph = new Chart(chart, {
    type: 'bar',
    data: {
      labels: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'],
      datasets: [
        {
          barPercentage: 0.9,
          barThickness: 20,
          maxBarThickness: 8,
          minBarLength: 1,
          data: [10, 20, 30, 40, 50, 60, 70],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
