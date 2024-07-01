document.getElementById('filter-button').addEventListener('click', function() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
            displayErrorMessage("End date cannot be earlier than start date.");
        } else {
            fetchData(startDate, endDate, true);
        }
    } else {
        displayErrorMessage("Please select both start and end dates.");
    }
});

let chart;

function fetchData(startDate, endDate, isFiltered = false) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    var data = JSON.parse(this.responseText);
                    console.log("Fetched data:", data);
                    var filteredData = filterDataByDateRange(data, startDate, endDate);
                    console.log("Filtered data:", filteredData);
                    if (filteredData.length === 0 && isFiltered) {
                        displayErrorMessage("No temperature data available");
                        var defaultDateRange = getDefaultDateRange();
                        filteredData = filterDataByDateRange(data, defaultDateRange.startDate, defaultDateRange.endDate);
                    } else {
                        clearErrorMessage();
                    }
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

function filterDataByDateRange(data, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log("Filtering data from", startDate, "to", endDate);

    return data.filter(row => {
        const date = new Date(row.date_stamp);
        console.log("Row date:", row.date_stamp, "Parsed date:", date);
        return date >= start && date <= end;
    });
}

function getDefaultDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    return {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
    };
}

function updateStats(data) {
    if (data.length === 0) return;

    let highestTemp = -Infinity, lowestTemp = Infinity;
    let highestTempDate = "", lowestTempDate = "";

    let highestHumidity = -Infinity, lowestHumidity = Infinity;
    let highestHumidityDate = "", lowestHumidityDate = "";

    data.forEach(row => {
        const temperature = parseFloat(row.temperature);
        const humidity = parseFloat(row.humidity);
        const date = row.date_stamp;

        console.log("Processing row:", row);

        if (temperature > highestTemp) {
            highestTemp = temperature;
            highestTempDate = date;
            console.log("New highest temperature:", highestTemp, "on", highestTempDate);
        }
        if (temperature < lowestTemp) {
            lowestTemp = temperature;
            lowestTempDate = date;
            console.log("New lowest temperature:", lowestTemp, "on", lowestTempDate);
        }
        if (humidity > highestHumidity) {
            highestHumidity = humidity;
            highestHumidityDate = date;
            console.log("New highest humidity:", highestHumidity, "on", highestHumidityDate);
        }
        if (humidity < lowestHumidity) {
            lowestHumidity = humidity;
            lowestHumidityDate = date;
            console.log("New lowest humidity:", lowestHumidity, "on", lowestHumidityDate);
        }
    });

    console.log("Final highest temperature:", highestTemp, "on", highestTempDate);
    console.log("Final lowest temperature:", lowestTemp, "on", lowestTempDate);
    console.log("Final highest humidity:", highestHumidity, "on", highestHumidityDate);
    console.log("Final lowest humidity:", lowestHumidity, "on", lowestHumidityDate);

    document.getElementById("highest-temperature").textContent = highestTemp + "°C";
    document.getElementById("highest-temperature-date").textContent = highestTempDate;
    document.getElementById("lowest-temperature").textContent = lowestTemp + "°C";
    document.getElementById("lowest-temperature-date").textContent = lowestTempDate;
    document.getElementById("highest-humidity").textContent = highestHumidity + "%";
    document.getElementById("highest-humidity-date").textContent = highestHumidityDate;
    document.getElementById("lowest-humidity").textContent = lowestHumidity + "%";
    document.getElementById("lowest-humidity-date").textContent = lowestHumidityDate;
}

function drawChart(data) {
    var ctx = document.getElementById('temperatureChart').getContext('2d');

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

function displayErrorMessage(message) {
    var modal = document.getElementById("errorModal");
    var span = document.getElementsByClassName("close")[0];

    document.getElementById("modal-message").textContent = message;

    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function clearErrorMessage() {
    var errorContainer = document.getElementById("data-container");
    errorContainer.innerHTML = "";
}

var defaultDateRange = getDefaultDateRange();
fetchData(defaultDateRange.startDate, defaultDateRange.endDate);
