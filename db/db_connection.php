<?php

function OpenCon() {
    $dbhost = "127.0.0.2";
    $db = "musicaia_db";
    $dbuser = "musicaia_db";
    $dbpass = "db24!";

    $dbhost = "freedb.tech";
//    $dbhost = "3.101.16.113";
    $db = "freedbtech_musicaidb";
    $dbuser = "freedbtech_db";
    $dbpass = "db";
    $conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n" . $conn->error);

    // Check connection
    if ($conn->connect_errno) {
        die("ERROR: Failed to connect to MySQL: " . $conn->connect_error);
    }

    return $conn;
}

function Query($conn, $q) {
    // Perform query
    if ($result = $conn->query($q)) {
        return $result;
    }
    die("Query Failed: " . $q . " |ERR: " . $conn->error);
}

function CloseCon($conn) {
    $conn->close();
}

?>