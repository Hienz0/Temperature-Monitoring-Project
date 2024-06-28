<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = ""; // Assuming no password set for root in your XAMPP setup
$dbname = "db_rpi";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch data from the table
$sql = "SELECT id_record, temperature, humidity, date_stamp, time_stamp FROM stg_incremental_load_rpi";
$result = $conn->query($sql);

// Check if any rows are returned
if ($result->num_rows > 0) {
    // Output data of each row in a table format
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Temperature</th><th>Humidity</th><th>Date</th><th>Time</th></tr>";
    
    // Open a log file for appending
    $logFile = fopen("data_log.txt", "a") or die("Unable to open file!");
    
    while($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row["id_record"] . "</td>";
        echo "<td>" . $row["temperature"] . "</td>";
        echo "<td>" . $row["humidity"] . "</td>";
        echo "<td>" . $row["date_stamp"] . "</td>";
        echo "<td>" . $row["time_stamp"] . "</td>";
        echo "</tr>";
        
        // Log each row to the file
        fwrite($logFile, "ID: " . $row["id_record"] . ", Temperature: " . $row["temperature"] . ", Humidity: " . $row["humidity"] . ", Date: " . $row["date_stamp"] . ", Time: " . $row["time_stamp"] . "\n");
    }
    
    echo "</table>";
    
    // Close the log file
    fclose($logFile);
} else {
    echo "0 results";
}

// Close connection
$conn->close();
?>
