document.getElementById('date-range').addEventListener('change', function() {
    fetchData(this.value);
});

let chart;

// Function to fetch data from fetch_data.php using AJAX
function fetchData(range = '1w') {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    var data = JSON.parse(this.responseText);
                    var filteredData = filterDataByRange(data, range);
                    updateStats(filteredData);
                    drawChart(filteredData);
                } catch (e) {
                    console.error("Error parsing JSON: ", e);
                    displayErrorMessage("Error parsing JSON data.");
                }
            } else {
                console.error("XHR request failed with status: ", this.status);
                displayErrorMessage("Failed to fetch data. Status: " + this.status);
            }
        }
    };
    xhr.open("GET", "fetch_data.php", true);
    xhr.send();
}

// Function to filter data based on date range
function filterDataByRange(data, range) {
    var now = new Date();
    var filteredData;

    if (range === '1w') {
        var oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        filteredData = data.filter(row => new Date(row.date_stamp) >= oneWeekAgo);
    } else if (range === '1m') {
        var oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filteredData = data.filter(row => new Date(row.date_stamp) >= oneMonthAgo);
    } else if (range === '1y') {
        var oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
        filteredData = data.filter(row => new Date(row.date_stamp) >= oneYearAgo);
    }

    return filteredData;
}

// Function to update the statistics
function updateStats(data) {
    let highestTemp = -Infinity, lowestTemp = Infinity;
    let highestTempDate = "", lowestTempDate = "";
    
    let highestHumidity = -Infinity, lowestHumidity = Infinity;
    let highestHumidityDate = "", lowestHumidityDate = "";

    data.forEach(row => {
        if (row.temperature > highestTemp) {
            highestTemp = row.temperature;
            highestTempDate = row.date_stamp;
        }
        if (row.temperature < lowestTemp) {
            lowestTemp = row.temperature;
            lowestTempDate = row.date_stamp;
        }
        if (row.humidity > highestHumidity) {
            highestHumidity = row.humidity;
            highestHumidityDate = row.date_stamp;
        }
        if (row.humidity < lowestHumidity) {
            lowestHumidity = row.humidity;
            lowestHumidityDate = row.date_stamp;
        }
    });

    document.getElementById("highest-temperature").textContent = highestTemp + "°C";
    document.getElementById("highest-temperature-date").textContent = highestTempDate;
    document.getElementById("lowest-temperature").textContent = lowestTemp + "°C";
    document.getElementById("lowest-temperature-date").textContent = lowestTempDate;
    document.getElementById("highest-humidity").textContent = highestHumidity + "%";
    document.getElementById("highest-humidity-date").textContent = highestHumidityDate;
    document.getElementById("lowest-humidity").textContent = lowestHumidity + "%";
    document.getElementById("lowest-humidity-date").textContent = lowestHumidityDate;
}

// Function to draw the chart
function drawChart(data) {
    var ctx = document.getElementById('temperatureChart').getContext('2d');

    // If the chart already exists, destroy it before creating a new one
    if (chart) {
        chart.destroy();
    }

    var chartData = {
        labels: data.map(row => row.date_stamp),
        datasets: [{
            label: 'Temperature',
            data: data.map(row => row.temperature),
            borderColor: 'blue',
            fill: false
        }, {
            label: 'Humidity',
            data: data.map(row => row.humidity),
            borderColor: 'cyan',
            fill: false
        }]
    };

    chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    });
}

// Function to display error message
function displayErrorMessage(message) {
    var errorContainer = document.getElementById("data-container");
    errorContainer.innerHTML = "<p class='error'>" + message + "</p>";
}

// Call fetchData() function to initiate data fetching and display
fetchData();
