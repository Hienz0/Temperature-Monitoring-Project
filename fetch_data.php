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
    $response = array("error" => "Connection failed: " . $conn->connect_error);
    echo json_encode($response);
    exit();
}

// Get the date range from the request
$date_range = isset($_GET['date_range']) ? $_GET['date_range'] : 7; // Default to last 7 days if not specified

// Calculate the start date based on the date range
$start_date = date('Y-m-d', strtotime("-$date_range days"));

// SQL query to fetch data from the table within the date range
$sql = "SELECT temperature, humidity, date_stamp FROM stg_incremental_load_rpi WHERE date_stamp >= '$start_date' ORDER BY date_stamp";
$result = $conn->query($sql);

// Initialize an array to store fetched data
$data = array();

// Check if any rows are returned
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row; // Store each row in the data array
    }
} else {
    $response = array("message" => "No results found.");
    echo json_encode($response);
    exit();
}

// Close connection
$conn->close();

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
