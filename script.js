const ctx = document.getElementById('tempHumidityChart').getContext('2d');
const tempHumidityChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
        },
        {
            label: 'Humidity',
            data: [],
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function fetchData() {
    $.ajax({
        url: 'fetch_data.php',
        method: 'GET',
        success: function(data) {
            const labels = data.map(item => item.date_stamp);
            const temperatures = data.map(item => item.temperature);
            const humidities = data.map(item => item.humidity);

            tempHumidityChart.data.labels = labels;
            tempHumidityChart.data.datasets[0].data = temperatures;
            tempHumidityChart.data.datasets[1].data = humidities;
            tempHumidityChart.update();

            const highestTemp = Math.max(...temperatures);
            const lowestTemp = Math.min(...temperatures);
            const highestHumidity = Math.max(...humidities);
            const lowestHumidity = Math.min(...humidities);

            $('#highest-temperature').text(highestTemp);
            $('#lowest-temperature').text(lowestTemp);
            $('#highest-humidity').text(highestHumidity);
            $('#lowest-humidity').text(lowestHumidity);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

$(document).ready(function() {
    fetchData();
});