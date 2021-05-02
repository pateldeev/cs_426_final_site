<!-- Page to log users out of website. -->


<?php

require_once "../db/db_connection.php";
$conn = OpenCon(true);

// Mark user as logged out.
$sql_q = "TRUNCATE TABLE `UserLogins`";
Query($conn, $sql_q);

// Unset all of the session variables.
session_start();
$_SESSION = array();
session_destroy();


// Redirect to home page
header("Location: ../index.html");
?>
