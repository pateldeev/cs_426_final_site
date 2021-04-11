<?php

// Initialize the session.
session_start();

// Unset all of the session variables.
$_SESSION = array();

// Destroy the session.
session_destroy();

$login_log = fopen("login_log.log", "a") or die("Unable to login log!");
fwrite($login_log, 'logout event' . PHP_EOL);
fclose($login_log);

// Redirect to home page
header("location: ../index.html");
?>
