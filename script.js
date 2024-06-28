// Function to fetch data from fetch_data.php using AJAX
function fetchData() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    var data = JSON.parse(this.responseText);
                    displayData(data);
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

// Function to display fetched data in HTML table format
function displayData(data) {
    var table = "<table>";
    table += "<tr><th>ID</th><th>Temperature</th><th>Humidity</th><th>Date</th><th>Time</th></tr>";
    
    data.forEach(function(row) {
        table += "<tr>";
        table += "<td>" + row.id_record + "</td>";
        table += "<td>" + row.temperature + "</td>";
        table += "<td>" + row.humidity + "</td>";
        table += "<td>" + row.date_stamp + "</td>";
        table += "<td>" + row.time_stamp + "</td>";
        table += "</tr>";
    });
    
    table += "</table>";
    document.getElementById("data-container").innerHTML = table;
}

// Function to display error message
function displayErrorMessage(message) {
    var errorContainer = document.getElementById("data-container");
    errorContainer.innerHTML = "<p class='error'>" + message + "</p>";
}

// Call fetchData() function to initiate data fetching and display
fetchData();
