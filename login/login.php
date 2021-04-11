<?php
// Initialize the session.
session_start();

$home_link = "location: ../user_home.html?user=";

// Check if the user is already logged in, if yes then redirect to home page.
if (isset($_GET["nocache"]) && $_GET['nocache']) {
    // Don't check cache.
    error_log('NoCache');
} else {
    // Check cache to see if user previously logged in.
    if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
        header($home_link . $_SESSION["username"]);
        exit;
    }

    // Check login history to see if user is logged in.
    $login_log = fopen("login_log.log", 'r+');
    $cursor = -1;
    fseek($login_log, $cursor, SEEK_END);
    $char = fgetc($login_log);
    while ($char === "\n" || $char === "\r") {
        fseek($login_log, $cursor--, SEEK_END);
        $char = fgetc($f);
    }
    $last_log_line = '';
    while ($char !== false && $char !== "\n" && $char !== "\r") {
        $last_log_line = $char . $last_log_line;
        fseek($login_log, $cursor--, SEEK_END);
        $char = fgetc($login_log);
    }
    fclose($login_log);

    if (substr_compare($last_log_line, 'login event: ', 0, strlen('login event: ')) === 0) {
    $last_log_line = substr($last_log_line, 0, -1);
        header($home_link . substr($last_log_line, strlen('login event: ')));
        exit;
    }
}


// Start database connection.
require_once "../db/db_connection.php";
$conn = OpenCon(true);

$username = $password = "";
$username_err = $password_err = "";

// Processing form data when form is submitted.
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if username is empty.
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter username.";
    } else {
        $username = trim($_POST["username"]);
    }

    // Check if password is empty.
    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter your password.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Validate credentials.
    if (empty($username_err) && empty($password_err)) {
        // Prepare a select statement
        $sql_q = "SELECT id, username, password FROM Users WHERE username = ?";

        if ($stmt = mysqli_prepare($conn, $sql_q)) {
            // Bind variables to the prepared statement as parameters.
            mysqli_stmt_bind_param($stmt, "s", $param_username);

            // Set parameters.
            $param_username = $username;

            // Attempt to execute the prepared statement.
            if (mysqli_stmt_execute($stmt)) {
                // Store result.
                mysqli_stmt_store_result($stmt);

                // Check if username exists, if yes then verify password.
                if (mysqli_stmt_num_rows($stmt) == 1) {
                    // Bind result variables.
                    mysqli_stmt_bind_result($stmt, $id, $username, $hashed_password);
                    if (mysqli_stmt_fetch($stmt)) {
                        if (password_verify($password, $hashed_password)) {
                            // Password is correct, so start a new session.
                            session_start();

                            // Store data in session variables.
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["username"] = $username;

                            // Log login history.
                            $login_log = fopen("login_log.log", "a") or die("Unable to login log!");
                            fwrite($login_log, 'login event: ' . $username . PHP_EOL);
                            fclose($login_log); 


                            // Redirect user to home page.
                            header($home_link . $_SESSION["username"]);
                        } else {
                            // Display an error message if password is not valid.
                            $password_err = "The password you entered was not valid.";
                        }
                    }
                } else {
                    // Display an error message if username doesn't exist.
                    $username_err = "No account found with that username.";
                }
            } else {
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement,
            mysqli_stmt_close($stmt);
        }
    }

    // Close connection.
    CloseCon($conn);
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="msapplication-TileColor" content="#da532c">
        <meta name="theme-color" content="#ffffff">

        <title>Login</title>

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
        <link rel="manifest" href="/favicon/site.webmanifest">
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg">

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
        <link rel="stylesheet" href="login.css">
    </head>
    <body>
        <div class="wrapper">
            <h2>Enter Credentials</h2>
            <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
                <div class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
                    <label>Username</label>
                    <input type="text" name="username" class="form-control" value="<?php echo $username; ?>">
                    <span class="help-block"><?php echo $username_err; ?></span>
                </div>    
                <div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control">
                    <span class="help-block"><?php echo $password_err; ?></span>
                </div>
                <div class="form-group">
                    <input type="submit" class="btn btn-primary" value="Login">
                </div>
                <p>Don't have an account? <a href="login_create.php">Sign up now</a>.</p>
            </form>
        </div>    
    </body>
</html>
